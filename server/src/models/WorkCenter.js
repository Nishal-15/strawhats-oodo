import mongoose from "mongoose";

const workCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      unique: true,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkCenter = mongoose.model(
  "WorkCenter",
  workCenterSchema
);