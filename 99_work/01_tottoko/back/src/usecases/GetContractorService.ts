import { injectable, inject } from "inversify";
import { ContractorRepository } from "../repository/ContractorRepository";
import { StudentRepository } from "../repository/StudentRepository";
import { TYPES } from "../utils/constants/types";
import { APIResponse } from "../model/entity/ApiResponse";
import { ContractorDetailDto } from "../model/entity/ContractorDetailDto";
import { ContractorProfileStubAdapter } from "../adapters/ContractorProfileStubAdapter";
import { Contractor } from "../model/entity/contractor";

@injectable()
export class GetContractoService {
  constructor(
    @inject(TYPES.ContractorRepository)
    private readonly contractorRepo: ContractorRepository,
    @inject(TYPES.StudentRepository)
    private readonly studentRepo: StudentRepository,
    @inject(TYPES.ContractorProfileStubAdapter)
    private readonly contractorProfileFromStub: ContractorProfileStubAdapter
  ) {}

  async get(
    contractorId: number,
    operatorId: number
  ): Promise<APIResponse<ContractorDetailDto>> {
    try {
      const contractorEntity = await this.contractorRepo.get(
        contractorId,
        operatorId
      );

      const studentEntity = await this.studentRepo.findAllByContractorId(
        contractorId
      );

      //スタブから取得

      const contractorProfile = await this.contractorProfileFromStub.get(
        contractorId
      );
      // ✅ contractor を“コピーして一部だけ差し替え”
      const contractorForView: Contractor = {
        ...contractorEntity,
        lastName: contractorProfile.lastName ?? contractorEntity.lastName,
        firstName: contractorProfile.firstName ?? contractorEntity.firstName,
        lastNameKana:
          contractorProfile.lastNameKana ?? contractorEntity.lastNameKana,
        firstNameKana:
          contractorProfile.firstNameKana ?? contractorEntity.firstNameKana,
      };

      const viewDto: ContractorDetailDto = {
        contractor: contractorForView,
        students: studentEntity,
      };

      return { statuscode: 200, data: viewDto };
    } catch (e) {
      //console.error("GetContractorService error:", e);
      throw e;
    }
  }
}
