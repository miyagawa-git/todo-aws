import { contractorProfile } from "../model/entity/contractorProfile";
//ports
export interface IContractorProfilePort {
  get(contractorId: number): Promise<contractorProfile>;
}
