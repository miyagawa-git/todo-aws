import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

// DB の1行と同じ情報の“型”
export interface StudentAttributes {
  studentId: number;
  contractorId: number;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  birthDate: string;
  phone: string;
}

export class StudentModel
  extends Model<StudentAttributes>
  //Sequelizeの機能（CRUD・DB操作）を使えるようにする
  implements StudentAttributes
{
  //型チェック専用
  public studentId!: number;
  public contractorId!: number; //! = 「あとで必ず入るから、今は undefined でも怒らないで。Sequelize が DB から値を入れるため
  public lastName!: string;
  public firstName!: string;
  public lastNameKana!: string;
  public firstNameKana!: string;
  public birthDate!: string;
  public phone!: string;
}
StudentModel.init(
  {
    studentId: { type: DataTypes.INTEGER, primaryKey: true },
    contractorId: { type: DataTypes.INTEGER },
    lastName: { type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING },
    lastNameKana: { type: DataTypes.STRING },
    firstNameKana: { type: DataTypes.STRING },
    birthDate: { type: DataTypes.DATEONLY },
    phone: { type: DataTypes.STRING },
  },
  {
    sequelize,
    tableName: "student",
    underscored: true, //キャメルケース ⇄ スネークケース を自動変換
  }
);
