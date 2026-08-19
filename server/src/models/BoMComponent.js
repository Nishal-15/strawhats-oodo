import mongoose from "mongoose";

const bomComponentSchema = new mongoose.Schema(
  {
    bom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoM",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.0001,
    },
  },
  {
    timestamps: true,
  }
);

bomComponentSchema.index(
  { bom: 1, product: 1 },
  { unique: true }
);

export const BoMComponent = mongoose.model(
  "BoMComponent",
  bomComponentSchema
);