import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "OPENING",
        "RESERVATION",
        "RELEASE",
        "CONSUMPTION",
        "RECEIPT",
        "PRODUCTION",
        "DELIVERY",
        "ADJUSTMENT",
      ],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    referenceType: {
      type: String,
      enum: [
        "PRODUCT",
        "SALES_ORDER",
        "PURCHASE_ORDER",
        "MANUFACTURING_ORDER",
        "MANUAL",
        "INVENTORY_ADJUSTMENT",
      ],
      default: "MANUAL",
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StockMovement = mongoose.model(
  "StockMovement",
  stockMovementSchema
);