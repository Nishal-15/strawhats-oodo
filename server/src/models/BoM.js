import mongoose from "mongoose";

const bomSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
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

export const BoM = mongoose.model("BoM", bomSchema);