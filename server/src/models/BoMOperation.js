import mongoose from "mongoose";

const bomOperationSchema = new mongoose.Schema(
  {
    bom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoM",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    sequence: {
      type: Number,
      required: true,
      min: 1,
    },

    workCenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkCenter",
    default:null,
    },

  },
  {
    timestamps: true,
  }
);

bomOperationSchema.index(
  { bom: 1, sequence: 1 },
  { unique: true }
);

export const BoMOperation = mongoose.model(
  "BoMOperation",
  bomOperationSchema
);