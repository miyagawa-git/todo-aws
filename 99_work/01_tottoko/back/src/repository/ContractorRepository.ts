import { injectable } from "inversify";
import { IContractorRepository } from "../model/interfaces/repository/IContractorRepository";
import { Contractor } from "../model/entity/contractor";
import { ContractorModel } from "../model/database/sequelize/contractor.model";

@injectable()
export class ContractorRepository implements IContractorRepository {
  async get(contractorId: number, operatorId: number): Promise<Contractor> {
    const model = await ContractorModel.findOne({
      where: {
        contractorId,
        operatorId,
      },
    });
    if (!model) throw new Error("Contractor not found");

    return this.toEntity(model);
  }
  private toEntity(m: ContractorModel): Contractor {
    return {
      lastName: m.lastName,
      firstName: m.firstName,
      lastNameKana: m.lastNameKana,
      firstNameKana: m.firstNameKana,
      birthDate: String(m.birthDate), // DATEONLYなら string化
      phone: m.phone,
    };
  }
}
