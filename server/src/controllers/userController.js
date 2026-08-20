import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED_ROLES = [
  "ADMIN",
  "SALES_USER",
  "PURCHASE_USER",
  "MANUFACTURE_USER",
  "INVENTORY_MANAGER",
  "BUSINESS_OWNER",
];

export async function createUser(req, res) {
  const {
    name,
    email,
    password,
    role,
  } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(
      400,
      "Name, email, password and role are required"
    );
  }

  if (!ALLOWED_ROLES.includes(role)) {
    throw new ApiError(
      400,
      "Invalid user role"
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "A user with this email already exists"
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    status: "ACTIVE",
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
}