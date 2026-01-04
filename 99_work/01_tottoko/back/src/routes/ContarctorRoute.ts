import { Router } from "express";
import { getContractor } from "../controller/ContractorController";

export const contractorRouter = Router();
contractorRouter.get("/", getContractor);
contractorRouter.get("/", getContractor);
