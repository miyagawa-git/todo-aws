import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { sequelize } from "./core/db";
import { todoRouter } from "./routes/todoRoutes";

async function bootstrap(){
    console.log("Loaded server.ts from:", __filename);

    await sequelize.sync();

    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json());

    // server.ts
app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.path);
  next();
});


    app.use("/api/todos", todoRouter);

app.use(
    (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
    }
  );

  const port = 3000;
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

bootstrap();