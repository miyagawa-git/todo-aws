import { createContext } from "react";
import type { ContractorDetailDto } from "../types/ContractorDetailDto";

export type ContractorContextValue = {
  contractor: ContractorDetailDto | null;
  loading: boolean;
  reload: (contractorId: number, operatorId: number) => Promise<void>;
};

export const ContractorContext = createContext<
  ContractorContextValue | undefined
>(undefined);
