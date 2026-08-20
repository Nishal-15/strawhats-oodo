import mongoose from "mongoose";
import { PurchaseOrder } from "../models/PurchaseOrder.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/Product.js";
import { StockMovement } from "../models/StockMovement.js";


export async function confirmPurchaseOrder({
  purchaseOrderId,
}) {
  const session = await mongoose.startSession();

  try {
    let confirmedOrder;

    await session.withTransaction(async () => {
      const order = await PurchaseOrder.findById(
        purchaseOrderId
      ).session(session);

      if (!order) {
        throw new ApiError(
          404,
          "Purchase order not found"
        );
      }

      if (order.status !== "DRAFT") {
        throw new ApiError(
          400,
          `Cannot confirm purchase order in ${order.status} status`
        );
      }

      order.status = "CONFIRMED";

      confirmedOrder = await order.save({
        session,
      });
    });

    return confirmedOrder;
  } finally {
    await session.endSession();
  }
}


export async function receivePurchaseOrder({
  purchaseOrderId,
  userId,
}) {
  const session = await mongoose.startSession();

  try {
    let receivedOrder;

    await session.withTransaction(async () => {
      const order = await PurchaseOrder.findById(
        purchaseOrderId
      ).session(session);

      if (!order) {
        throw new ApiError(
          404,
          "Purchase order not found"
        );
      }

      if (order.status !== "CONFIRMED") {
        throw new ApiError(
          400,
          `Cannot receive purchase order in ${order.status} status`
        );
      }

      // Validate every product first
      for (const item of order.items) {
        const product = await Product.findById(
          item.product
        ).session(session);

        if (!product) {
          throw new ApiError(
            404,
            "Purchase order product not found"
          );
        }
      }

      // Increase inventory
      for (const item of order.items) {
        const product = await Product.findById(
          item.product
        ).session(session);

        product.stock.onHand += item.quantity;

        await product.save({ session });

        await StockMovement.create(
          [
            {
              product: product._id,
              type: "RECEIPT",
              quantity: item.quantity,
              referenceType: "PURCHASE_ORDER",
              referenceId: order._id,
              performedBy: userId,
              note: `Received Purchase Order ${order._id}`,
            },
          ],
          { session }
        );
      }

      order.status = "RECEIVED";

      receivedOrder = await order.save({
        session,
      });
    });

    return receivedOrder;
  } finally {
    await session.endSession();
  }
}