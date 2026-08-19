import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { StockMovement } from "../models/StockMovement.js";
import { ApiError } from "../utils/ApiError.js";

export async function reserveStock({
  productId,
  quantity,
  userId,
  referenceType = "MANUAL",
  referenceId = null,
  note = "",
}) {
  if (quantity <= 0) {
    throw new ApiError(400, "Reservation quantity must be greater than zero");
  }

  const session = await mongoose.startSession();

  try {
    let updatedProduct;

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      const freeToUse = product.stock.onHand - product.stock.reserved;

      if (freeToUse < quantity) {
        throw new ApiError(
          400,
          `Insufficient free stock. Available: ${freeToUse}`
        );
      }

      product.stock.reserved += quantity;

      updatedProduct = await product.save({ session });

      await StockMovement.create(
        [
          {
            product: product._id,
            type: "RESERVATION",
            quantity,
            referenceType,
            referenceId,
            performedBy: userId,
            note,
          },
        ],
        { session }
      );
    });

    return updatedProduct;
  } finally {
    await session.endSession();
  }
}
export async function releaseStock({
  productId,
  quantity,
  userId,
  referenceType = "MANUAL",
  referenceId = null,
  note = "",
}) {
  if (quantity <= 0) {
    throw new ApiError(400, "Release quantity must be greater than zero");
  }

  const session = await mongoose.startSession();

  try {
    let updatedProduct;

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      if (product.stock.reserved < quantity) {
        throw new ApiError(
          400,
          `Cannot release ${quantity}. Reserved stock: ${product.stock.reserved}`
        );
      }

      product.stock.reserved -= quantity;

      updatedProduct = await product.save({ session });

      await StockMovement.create(
        [
          {
            product: product._id,
            type: "RELEASE",
            quantity,
            referenceType,
            referenceId,
            performedBy: userId,
            note,
          },
        ],
        { session }
      );
    });

    return updatedProduct;
  } finally {
    await session.endSession();
  }
}

export async function consumeStock({
  productId,
  quantity,
  userId,
  referenceType = "MANUAL",
  referenceId = null,
  note = "",
}) {
  if (quantity <= 0) {
    throw new ApiError(400, "Consumption quantity must be greater than zero");
  }

  const session = await mongoose.startSession();

  try {
    let updatedProduct;

    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      const freeToUse =
        product.stock.onHand - product.stock.reserved;

      if (freeToUse < quantity) {
        throw new ApiError(
          400,
          `Insufficient free stock. Available: ${freeToUse}`
        );
      }

      product.stock.onHand -= quantity;

      updatedProduct = await product.save({ session });

      await StockMovement.create(
        [
          {
            product: product._id,
            type: "CONSUMPTION",
            quantity,
            referenceType,
            referenceId,
            performedBy: userId,
            note,
          },
        ],
        { session }
      );
    });

    return updatedProduct;
  } finally {
    await session.endSession();
  }
}