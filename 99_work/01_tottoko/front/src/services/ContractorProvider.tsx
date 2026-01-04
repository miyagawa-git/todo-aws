// src/context/TodoContext.tsx
import React, { useCallback, useState } from "react";
import type { ContractorDetailDto } from "../types/ContractorDetailDto";
import { contractorApi } from "../routes/contractorApi";
import { ContractorContext } from "./ContractorContext";

export const ContractorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contractor, setContractor] = useState<ContractorDetailDto | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const reload = useCallback(
    async (contractorId: number, operatorId: number) => {
      setLoading(true);
      //TODO:失敗時のエラーハンドリング追加error state
      try {
        const data = await contractorApi.getContractor(
          contractorId,
          operatorId
        );
        setContractor(data);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <ContractorContext.Provider value={{ contractor, loading, reload }}>
      {children}
    </ContractorContext.Provider>
  );
};

// export const useContractor = () => {
//   const ctx = useContext(ContractorContext);
//   if (!ctx) throw new Error("useTodos must be used within TodoProvider");
//   return ctx;
// };
