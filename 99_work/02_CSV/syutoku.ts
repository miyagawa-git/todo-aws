import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";

type InputFileInfo = {
  columnName: string;
  filePath: string; // S3キー
};

const s3Client = new S3Client({
  region: "ap-northeast-1",
});

async function collectCsvFilesWithUndefinedFromS3(
  bucketName: string,
  folderPrefix: string
): Promise<(InputFileInfo | undefined)[]> {
  // 末尾に / がなければ付ける
  const normalizedPrefix = folderPrefix.endsWith("/")
    ? folderPrefix
    : `${folderPrefix}/`;

  const targetFileNames = [
    "test.csv",
    ...Array.from({ length: 10 }, (_, i) => `param${i + 1}.csv`),
  ];

  const existingKeys = new Set<string>();

  let continuationToken: string | undefined = undefined;

  do {
    const response: ListObjectsV2CommandOutput = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: normalizedPrefix,
        ContinuationToken: continuationToken,
      })
    );

    for (const content of response.Contents ?? []) {
      if (content.Key) {
        existingKeys.add(content.Key);
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return targetFileNames.map((fileName) => {
    const key = `${normalizedPrefix}${fileName}`;

    if (!existingKeys.has(key)) {
      return undefined;
    }

    return {
      columnName: fileName.replace(".csv", ""),
      filePath: key,
    };
  });
}

// 実行例
async function main(): Promise<void> {
  const result = await collectCsvFilesWithUndefinedFromS3(
    "my-bucket",
    "import/2026-03-18"
  );

  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

======================================

import {
  S3Client,
  HeadObjectCommand,
  NotFound,
} from "@aws-sdk/client-s3";

type InputFileInfo = {
  columnName: string;
  filePath: string;
};

const s3Client = new S3Client({
  region: "ap-northeast-1",
});

async function existsObject(
  bucketName: string,
  key: string
): Promise<boolean> {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    return true;
  } catch (error: unknown) {
    // 404系なら存在しない扱い
    if (
      typeof error === "object" &&
      error !== null &&
      "$metadata" in error
    ) {
      const statusCode = (error as { $metadata?: { httpStatusCode?: number } })
        .$metadata?.httpStatusCode;

      if (statusCode === 404) {
        return false;
      }
    }
    throw error;
  }
}

async function collectCsvFilesWithUndefinedFromS3ByHead(
  bucketName: string,
  folderPrefix: string
): Promise<(InputFileInfo | undefined)[]> {
  const normalizedPrefix = folderPrefix.endsWith("/")
    ? folderPrefix
    : `${folderPrefix}/`;

  const targetFileNames = [
    "test.csv",
    ...Array.from({ length: 10 }, (_, i) => `param${i + 1}.csv`),
  ];

  return Promise.all(
    targetFileNames.map(async (fileName) => {
      const key = `${normalizedPrefix}${fileName}`;
      const exists = await existsObject(bucketName, key);

      if (!exists) {
        return undefined;
      }

      return {
        columnName: fileName.replace(".csv", ""),
        filePath: key,
      };
    })
  );
}