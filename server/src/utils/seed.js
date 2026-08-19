import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import { User } from "../models/User.js";

await connectDB();

const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

await User.updateOne(
  { email: "admin@shiverp.local" },
  {
    $set: {
      name: "System Administrator",
      email: "admin@shiverp.local",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  },
  { upsert: true }
);

console.log("Admin seed completed.");
await disconnectDB();
await mongoose.connection.close();
