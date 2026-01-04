import { Container } from "inversify";
import { ContractorRepository } from "../repository/ContractorRepository";
import { IContractorRepository } from "../model/interfaces/repository/IContractorRepository";
import { TYPES } from "../utils/constants/types";
import { IGetContractorService } from "../model/interfaces/usecases/IGetContractorService";
import { IStundentRepository } from "../model/interfaces/repository/IStudentRepository";
import { StudentRepository } from "../repository/StudentRepository";
import { GetContractoService } from "../usecases/GetContractorService";
import { IContractorProfilePort } from "../ports/IContractorProfilePort";
import { ContractorProfileStubAdapter } from "../adapters/ContractorProfileStubAdapter";
const container = new Container();

container
  .bind<IContractorRepository>(TYPES.ContractorRepository)
  .to(ContractorRepository);

container
  .bind<IStundentRepository>(TYPES.StudentRepository)
  .to(StudentRepository);

container
  .bind<IGetContractorService>(TYPES.GetContractoService)
  .to(GetContractoService);

container
  .bind<IContractorProfilePort>(TYPES.ContractorProfileStubAdapter)
  .to(ContractorProfileStubAdapter);

export { container };
