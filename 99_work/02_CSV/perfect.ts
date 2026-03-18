import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import { once } from "events";
import { Readable } from "stream";
import {
  S3Client,
  GetObjectCommand,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3";

type ColumnName =
  | "test"
  | "param1"
  | "param2"
  | "param3"
  | "param4"
  | "param5"
  | "param6"
  | "param7"
  | "param8"
  | "param9"
  | "param10";

type InputFileInfo = {
  columnName: ColumnName;
  key: string;
};

type MergeFromS3Options = {
  bucketName: string;
  folderPrefix: string;
  outputPath: string;
  region?: string;
};

type CsvCursor = {
  header: string;
  nextValue: () => Promise<IteratorResult<string>>;
  close: () => void;
};

const TARGET_COLUMNS: ColumnName[] = [
  "test",
  "param1",
  "param2",
  "param3",
  "param4",
  "param5",
  "param6",
  "param7",
  "param8",
  "param9",
  "param10",
];

function normalizePrefix(prefix: string): string {
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
}

function escapeCsv(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function writeLineSafely(
  writer: fs.WriteStream,
  line: string
): Promise<void> {
  if (!writer.write(line)) {
    await once(writer, "drain");
  }
}

/**
 * S3 の特定 prefix 配下から、
 * test.csv, param1.csv ～ param10.csv を固定順で並べ、
 * 存在しないものは undefined のまま返す
 */
async function collectCsvFilesWithUndefinedFromS3(
  s3Client: S3Client,
  bucketName: string,
  folderPrefix: string
): Promise<(InputFileInfo | undefined)[]> {
  const normalizedPrefix = normalizePrefix(folderPrefix);
  const existingKeys = new Set<string>();

  const paginator = paginateListObjectsV2(
    { client: s3Client },
    {
      Bucket: bucketName,
      Prefix: normalizedPrefix,
    }
  );

  for await (const page of paginator) {
    for (const content of page.Contents ?? []) {
      if (content.Key) {
        existingKeys.add(content.Key);
      }
    }
  }

  return TARGET_COLUMNS.map((columnName) => {
    const key = `${normalizedPrefix}${columnName}.csv`;

    if (!existingKeys.has(key)) {
      return undefined;
    }

    return {
      columnName,
      key,
    };
  });
}

/**
 * S3 の 1 列 CSV を 1 行ずつ読むカーソルを作る
 * 1行目はヘッダー、2行目以降がデータ
 */
async function createS3CsvCursor(
  s3Client: S3Client,
  bucketName: string,
  key: string
): Promise<CsvCursor> {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error(`S3オブジェクトのBodyが取得できませんでした: ${key}`);
  }

  const stream = response.Body as Readable;

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const iterator = rl[Symbol.asyncIterator]();

  const headerResult = await iterator.next();
  if (headerResult.done || headerResult.value == null) {
    rl.close();
    stream.destroy();
    throw new Error(`S3オブジェクトが空です: ${key}`);
  }

  const header = headerResult.value.trim();

  return {
    header,
    nextValue: async () => {
      const result = await iterator.next();

      if (result.done) {
        return { done: true, value: undefined };
      }

      return {
        done: false,
        value: result.value.trimEnd(),
      };
    },
    close: () => {
      rl.close();
      stream.destroy();
    },
  };
}

/**
 * S3上の1列CSV群を横結合してローカルに1ファイル出力する
 *
 * - test,param1...param10 の固定11列で出力
 * - 存在しないファイルは空列
 * - 存在するファイル同士の行数がズレたらエラー
 */
async function mergeSingleColumnCsvFilesFromS3(
  options: MergeFromS3Options
): Promise<void> {
  const s3Client = new S3Client({
    region: options.region ?? "ap-northeast-1",
  });

  const fileDefinitions = await collectCsvFilesWithUndefinedFromS3(
    s3Client,
    options.bucketName,
    options.folderPrefix
  );

  const existingCount = fileDefinitions.filter(
    (file): file is InputFileInfo => file !== undefined
  ).length;

  if (existingCount === 0) {
    throw new Error("対象CSVが1件も存在しません。");
  }

  fs.mkdirSync(path.dirname(options.outputPath), { recursive: true });

  const writer = fs.createWriteStream(options.outputPath, { encoding: "utf-8" });

  // 各列ごとのカーソル。存在しない列は undefined のまま持つ
  const cursors: (CsvCursor | undefined)[] = new Array(fileDefinitions.length).fill(
    undefined
  );

  try {
    for (let i = 0; i < fileDefinitions.length; i++) {
      const file = fileDefinitions[i];

      if (!file) {
        continue;
      }

      const cursor = await createS3CsvCursor(
        s3Client,
        options.bucketName,
        file.key
      );

      // ヘッダーが期待値と違ったら落とす
      if (cursor.header !== file.columnName) {
        throw new Error(
          `ヘッダー不一致: key=${file.key}, expected=${file.columnName}, actual=${cursor.header}`
        );
      }

      cursors[i] = cursor;
    }

    // 出力ヘッダーは固定11列
    await writeLineSafely(
      writer,
      TARGET_COLUMNS.map((name) => escapeCsv(name)).join(",") + "\n"
    );

    let rowNumber = 2;

    while (true) {
      const rowResults = await Promise.all(
        cursors.map(async (cursor) => {
          if (!cursor) {
            // ファイルが存在しない列は常に空列
            return {
              type: "missing" as const,
              done: false,
              value: "",
            };
          }

          const result = await cursor.nextValue();

          if (result.done) {
            return {
              type: "present" as const,
              done: true,
              value: "",
            };
          }

          return {
            type: "present" as const,
            done: false,
            value: result.value ?? "",
          };
        })
      );

      const presentResults = rowResults.filter(
        (result) => result.type === "present"
      );

      const presentDoneCount = presentResults.filter(
        (result) => result.done
      ).length;

      // 存在するファイルが全部終了したら終わり
      if (presentDoneCount === presentResults.length) {
        break;
      }

      // 一部だけ終わったら行数不一致
      if (presentDoneCount > 0 && presentDoneCount < presentResults.length) {
        throw new Error(
          `存在するCSVの行数が一致しません。CSV行番号=${rowNumber}`
        );
      }

      const mergedLine = rowResults
        .map((result) => escapeCsv(result.value))
        .join(",");

      await writeLineSafely(writer, mergedLine + "\n");
      rowNumber++;
    }
  } finally {
    for (const cursor of cursors) {
      cursor?.close();
    }

    writer.end();
    await once(writer, "finish");
  }
}

/**
 * 実行例
 */
async function main(): Promise<void> {
  await mergeSingleColumnCsvFilesFromS3({
    bucketName: "your-bucket-name",
    folderPrefix: "import/2026-03-18",
    outputPath: "./output/merged.csv",
    region: "ap-northeast-1",
  });

  console.log("CSV結合完了");
}

main().catch((error) => {
  console.error("エラー:", error);
  process.exit(1);
});