import { Contractor } from "../../entity/contractor";

export interface IContractorRepository {
  get(contractorId: number, operatorId: number): Promise<Contractor>;
}
