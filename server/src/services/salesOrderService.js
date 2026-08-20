import mongoose from "mongoose";
import { SalesOrder } from "../models/SalesOrder.js";
import { Product } from "../models/Product.js";
import { StockMovement } from "../models/StockMovement.js";
import { ApiError } from "../utils/ApiError.js";

export async function confirmSalesOrder({
  salesOrderId,
  userId,
}) {
  const session = await mongoose.startSession();

  try {
    let confirmedOrder;

    await session.withTransaction(async () => {
      const order = await SalesOrder.findById(
        salesOrderId
      ).session(session);

      if (!order) {
        throw new ApiError(
          404,
          "Sales order not found"
        );
      }

      if (order.status !== "DRAFT") {
        throw new ApiError(
          400,
          `Cannot confirm sales order in ${order.status} status`
        );
      }

      // Check all items before reserving anything
      for (const item of order.items) {
        const product = await Product.findById(
          item.product
        ).session(session);

        if (!product) {
          throw new ApiError(
            404,
            "Sales order product not found"
          );
        }

        const freeToUse =
          product.stock.onHand -
          product.stock.reserved;

        if (freeToUse < item.quantity) {
          throw new ApiError(
            400,
            `Insufficient stock for ${product.name}. Required: ${item.quantity}, Available: ${freeToUse}`
          );
        }
      }

      // Reserve all items
      for (const item of order.items) {
        const product = await Product.findById(
          item.product
        ).session(session);

        product.stock.reserved += item.quantity;

        await product.save({ session });

        await StockMovement.create(
          [
            {
              product: product._id,
              type: "RESERVATION",
              quantity: item.quantity,
              referenceType: "SALES_ORDER",
              referenceId: order._id,
              performedBy: userId,
              note: `Reserved for Sales Order ${order._id}`,
            },
          ],
          { session }
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

export async function deliverSalesOrder({
  salesOrderId,
  userId,
}) {
  const session = await mongoose.startSession();

  try {
    let deliveredOrder;

    await session.withTransaction(async () => {
      const order = await SalesOrder.findById(
        salesOrderId
      ).session(session);

      if (!order) {
        throw new ApiError(
          404,
          "Sales order not found"
        );
      }

      if (order.status !== "CONFIRMED") {
        throw new ApiError(
          400,
          `Cannot deliver sales order in ${order.status} status`
        );
      }

      // Validate all items before changing anything
      for (const item of order.items) {
        const product = await Product.findById(
          item.product
        ).session(session);

        if (!product) {
          throw new ApiError(
            404,
            "Sales order product not found"
          );
        }

        if (product.stock.reserved < item.quantity) {
          throw new ApiError(
            400,
            `Reserved stock is insufficient for ${product.name}`
          );
        }

        if (product.stock.onHand < item.quantity) {
          throw new ApiError(
            400,
            `On-hand stock is insufficient for ${product.name}`
          );
        }
      }

      // Deliver every item
      for (const item of order.items) {
        const product = await Product.findById(
          item.product
        ).session(session);

        product.stock.onHand -= item.quantity;
        product.stock.reserved -= item.quantity;

        await product.save({ session });

        await StockMovement.create(
          [
            {
              product: product._id,
              type: "CONSUMPTION",
              quantity: item.quantity,
              referenceType: "SALES_ORDER",
              referenceId: order._id,
              performedBy: userId,
              note: `Delivered Sales Order ${order._id}`,
            },
          ],
          { session }
        );
      }

      order.status = "DELIVERED";

      deliveredOrder = await order.save({
        session,
      });
    });

    return deliveredOrder;
  } finally {
    await session.endSession();
  }
}