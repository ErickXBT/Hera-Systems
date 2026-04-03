import express, { type Express } from "express";
import cors from "cors";
import pinoHttp = require("pino-http"); // ✅ ini yang benar untuk CJS
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: (req: any) => ({
      id: req.id,
      method: req.method,
      url: req.url?.split("?")[0],
    }),
    res: (res: any) => ({
      statusCode: res.statusCode,
    }),
  },
});

app.use(httpLogger);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;