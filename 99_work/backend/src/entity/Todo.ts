import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../core/db";

// DB の1行と同じ情報の“型”
export interface TodoAttributes {
    id: number;
    title:string;
    done:boolean;
}

// TodoAttributes のうち
// id と done を 任意（省略可） にした型を作る。
export interface TodoCreationAttributes
    extends Optional<TodoAttributes, "id" | "done">{}

export class Todo
    extends Model<TodoAttributes,TodoCreationAttributes>
    implements TodoAttributes
    {
        public id!:number;
        public title!:string;
        public done!: boolean;
    }
// 実際のテーブルのカラムの設定。
Todo.init(
     {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    done: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    tableName: "todos",
  }
)