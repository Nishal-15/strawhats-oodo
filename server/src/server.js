import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const app = createApp();

try {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Mini ERP API running at http://localhost:${env.PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
