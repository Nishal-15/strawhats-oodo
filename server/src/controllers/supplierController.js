import { Supplier } from "../models/Supplier.js";
import { ApiError } from "../utils/ApiError.js";

export async function createSupplier(req, res) {
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    throw new ApiError(
      400,
      "Name and email are required"
    );
  }

  const existingSupplier = await Supplier.findOne({
    email: email.toLowerCase(),
  });

  if (existingSupplier) {
    throw new ApiError(
      409,
      "Supplier with this email already exists"
    );
  }

  const supplier = await Supplier.create({
    name,
    email,
    phone,
    address,
  });

  res.status(201).json({
    success: true,
    message: "Supplier created successfully",
    supplier,
  });
}

export async function getSuppliers(req, res) {
  const suppliers = await Supplier.find({
    active: true,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    suppliers,
  });
}