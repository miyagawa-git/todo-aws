import { Request, Response, NextFunction } from "express";
import { container } from "../config/inversify.config";
import { IGetContractorService } from "../model/interfaces/usecases/IGetContractorService";
import { TYPES } from "../utils/constants/types";

export const getContractor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = container.get<IGetContractorService>(
      TYPES.GetContractoService
    );
    const { contractorId, operatorId } = req.query;

    //   if (!Number.isFinite(contractorId) || !Number.isFinite(operatorId)) {
    //     return res.status(401).json({ statuscode: 401, data: null });
    //   }

    console.log("デバッグ：", contractorId, operatorId);
    const result = await service.get(Number(contractorId), Number(operatorId));
    res.status(result.statuscode).json(result);
  } catch (e) {
    next(e);
  }
};
