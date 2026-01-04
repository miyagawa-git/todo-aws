import { Contractor } from "./contractor";
import { Student } from "./student";

export type ContractorDetailDto = {
  contractor: Contractor;
  students: Student[];
};
