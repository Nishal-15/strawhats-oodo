import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Mini ERP backend is running",
  });
});

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(`Mini ERP backend running on port ${PORT}`);
});