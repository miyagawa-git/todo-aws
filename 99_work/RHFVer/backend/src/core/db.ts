import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "tododb",      // DB名
  "postgres",    // ユーザー名
  "pass",// パスワード
  {
    host: "localhost",
    port: 15432,
    dialect: "postgres",
    logging: false
  }
);
