import { Customer } from "../models/Customer.js";
import { ApiError } from "../utils/ApiError.js";

export async function createCustomer(req, res) {
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    throw new ApiError(
      400,
      "Name and email are required"
    );
  }

  const existingCustomer = await Customer.findOne({
    email: email.toLowerCase(),
  });

  if (existingCustomer) {
    throw new ApiError(
      409,
      "Customer with this email already exists"
    );
  }

  const customer = await Customer.create({
    name,
    email,
    phone,
    address,
  });

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    customer,
  });
}

export async function getCustomers(req, res) {
  const customers = await Customer.find({
    active: true,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    customers,
  });
}