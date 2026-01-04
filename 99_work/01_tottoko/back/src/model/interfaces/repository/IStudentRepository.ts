import { Student } from "../../entity/student";
export interface IStundentRepository {
  findAllByContractorId(contractorId: number): Promise<Student[]>;
}
