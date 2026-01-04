import { injectable } from "inversify";
import { IStundentRepository } from "../model/interfaces/repository/IStudentRepository";
import { Student } from "../model/entity/student";
import { StudentModel } from "../model/database/sequelize/student.model";
@injectable()
export class StudentRepository implements IStundentRepository {
  async findAllByContractorId(contractorId: number): Promise<Student[]> {
    const models = await StudentModel.findAll({
      where: { contractorId },
      order: [["contractorId", "DESC"]],
    });

    return (await models).map((m) => this.toEntity(m));
  }
  private toEntity(m: StudentModel): Student {
    return {
      studentId: m.studentId,
      contractorId: m.contractorId,
      lastName: m.lastName,
      firstName: m.firstName,
      lastNameKana: m.lastNameKana,
      firstNameKana: m.firstNameKana,
      birthDate: String(m.birthDate), // DATEONLYなら string化
      phone: m.phone,
    };
  }
}
