import { WorkCenter } from "../models/WorkCenter.js";
import { ApiError } from "../utils/ApiError.js";

export async function createWorkCenter(req, res) {
  const { name, location = "" } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Work center name is required");
  }

  const existing = await WorkCenter.findOne({
    name: name.trim(),
  });

  if (existing) {
    throw new ApiError(409, "Work center already exists");
  }

  const workCenter = await WorkCenter.create({
    name: name.trim(),
    location,
  });

  res.status(201).json({
    success: true,
    message: "Work center created successfully",
    workCenter,
  });
}

export async function getWorkCenters(req, res) {
  const workCenters = await WorkCenter.find({
    active: true,
  }).sort({ name: 1 });

  res.json({
    success: true,
    workCenters,
  });
}