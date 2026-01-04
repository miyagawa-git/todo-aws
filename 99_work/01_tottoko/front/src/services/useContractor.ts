import { useContext } from "react";
import { ContractorContext } from "./ContractorContext";

export const useContractor = () => {
  const ctx = useContext(ContractorContext);
  if (!ctx)
    throw new Error("useContractor must be used within ContractorProvider");
  return ctx;
};
