import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 40,
    },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    salesPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, required: true, min: 0 },
    stock: {
      onHand: { type: Number, default: 0, min: 0 },
      reserved: { type: Number, default: 0, min: 0 },
    },
    procurementStrategy: {
      type: String,
      enum: ["MTS", "MTO"],
      default: "MTS",
    },
    procurementType: {
      type: String,
      enum: ["PURCHASE", "MANUFACTURE"],
      default: "PURCHASE",
    },
    vendorName: { type: String, trim: true, maxlength: 160, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.virtual("freeToUse").get(function () {
  return Math.max(0, this.stock.onHand - this.stock.reserved);
});

productSchema.set("toJSON", { virtuals: true });

export const Product = mongoose.model("Product", productSchema);
