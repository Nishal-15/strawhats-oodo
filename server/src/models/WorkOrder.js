import mongoose from "mongoose";

const workOrderSchema = new mongoose.Schema(
  {
    manufacturingOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ManufacturingOrder",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    sequence: {
      type: Number,
      required: true,
      min: 1,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    workCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkCenter",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

workOrderSchema.index(
  { manufacturingOrder: 1, sequence: 1 },
  { unique: true }
);

export const WorkOrder = mongoose.model(
  "WorkOrder",
  workOrderSchema
);