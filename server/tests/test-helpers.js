import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";
import { User } from "../src/models/User.js";

export async function setupTestDB() {
  const mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const passwordHash = await bcrypt.hash("Password123!", 10);
  await User.create({
    name: "Test Admin",
    email: "admin@test.local",
    passwordHash,
    role: "ADMIN",
  });

  return mongo;
}

export async function teardownTestDB(mongo) {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongo.stop();
}
