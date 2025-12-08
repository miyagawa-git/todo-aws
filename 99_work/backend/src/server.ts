import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { sequelize } from "./core/db";
import { todoRouter } from "./routes/todoRoutes";

async function bootstrap(){
    await sequelize.sync();

    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json);

    app.use("/api/todos", todoRouter);

    app.use(
        (err: any, req: express.Request,res:express.Response,next:express.NextFunction) =>{
            console.error(err);
            res.status(500).json({message: "Inte"})
        }
    )
}