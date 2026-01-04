import { injectable, inject } from "inversify";
import { contractorProfile } from "../model/entity/contractorProfile";
import { IContractorProfilePort } from "../ports/IContractorProfilePort";

export class ContractorProfileStubAdapter implements IContractorProfilePort {
  async get(contractorId: number): Promise<contractorProfile> {
    // if (contractorId) {
    return {
      lastName: "むに島",
      firstName: "ハムなり",
      lastNameKana: "ムニジマ",
      firstNameKana: "ハムナリ",
      birthDate: "2025-01-01",
      phone: "090-1234-5678",
      zipCode: "200-1234",
      address: "テスト県テスト市",
      email: "test@test.co.jp",
    };
    //}
  }
}
