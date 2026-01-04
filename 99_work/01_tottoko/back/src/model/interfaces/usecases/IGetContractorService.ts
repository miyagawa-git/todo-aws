import { APIResponse } from "../../entity/ApiResponse";
import { ContractorDetailDto } from "../../entity/ContractorDetailDto";

export interface IGetContractorService {
  get(
    contractorId: number,
    operatorId: number
  ): Promise<APIResponse<ContractorDetailDto>>;
}
