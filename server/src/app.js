import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.get("/health", (req, res) => {
    res.json({ success: true, service: "mini-erp-api", status: "ok" });
  });

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
