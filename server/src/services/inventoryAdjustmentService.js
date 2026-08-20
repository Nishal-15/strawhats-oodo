import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { InventoryAdjustment } from "../models/InventoryAdjustment.js";
import { StockMovement } from "../models/StockMovement.js";
import { ApiError } from "../utils/ApiError.js";

export async function createInventoryAdjustment({
  productId,
  quantity,
  reason,
  userId,
}) {
  const session = await mongoose.startSession();

  try {
    let adjustment;

    await session.withTransaction(async () => {
      if (!quantity || quantity === 0) {
        throw new ApiError(
          400,
          "Adjustment quantity cannot be zero"
        );
      }

      if (!reason || !reason.trim()) {
        throw new ApiError(
          400,
          "Adjustment reason is required"
        );
      }

      const product = await Product.findOne({
        _id: productId,
        active: true,
      }).session(session);

      if (!product) {
        throw new ApiError(
          404,
          "Product not found"
        );
      }

      const newOnHand =
        product.stock.onHand + quantity;

      if (newOnHand < 0) {
        throw new ApiError(
          400,
          `Insufficient stock. Current on-hand stock: ${product.stock.onHand}`
        );
      }

      product.stock.onHand = newOnHand;

      await product.save({ session });

      adjustment =
        await InventoryAdjustment.create(
          [
            {
              product: product._id,
              quantity,
              reason: reason.trim(),
              createdBy: userId,
            },
          ],
          { session }
        );

      await StockMovement.create(
        [
          {
            product: product._id,
            type: "ADJUSTMENT",
            quantity: Math.abs(quantity),
            referenceType: "INVENTORY_ADJUSTMENT",
            referenceId: adjustment[0]._id,
            performedBy: userId,
            note: reason.trim(),
          },
        ],
        { session }
      );

      adjustment = adjustment[0];
    });

    return adjustment;
  } finally {
    await session.endSession();
  }
}