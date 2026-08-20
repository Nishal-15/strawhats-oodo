import mongoose from "mongoose";
import { ManufacturingOrder } from "../models/ManufacturingOrder.js";
import { Product } from "../models/Product.js";
import { StockMovement } from "../models/StockMovement.js";
import { ApiError } from "../utils/ApiError.js";
import { WorkOrder } from "../models/WorkOrder.js";

export async function confirmManufacturingOrder({
  manufacturingOrderId,
  userId,
}) {
  const session = await mongoose.startSession();

  try {
    let updatedMO;

    await session.withTransaction(async () => {
      const mo = await ManufacturingOrder.findById(
        manufacturingOrderId
      ).session(session);

      if (!mo) {
        throw new ApiError(
          404,
          "Manufacturing order not found"
        );
      }

      if (mo.status !== "DRAFT") {
        throw new ApiError(
          400,
          `Cannot confirm MO in ${mo.status} status`
        );
      }

      // Check every component before changing anything
      for (const component of mo.components) {
        const product = await Product.findById(
          component.product
        ).session(session);

        if (!product) {
          throw new ApiError(
            404,
            "Manufacturing component product not found"
          );
        }

        const freeToUse =
          product.stock.onHand -
          product.stock.reserved;

        if (freeToUse < component.requiredQuantity) {
          throw new ApiError(
            400,
            `Insufficient stock for ${product.name}. Required: ${component.requiredQuantity}, Available: ${freeToUse}`
          );
        }
      }

      // Reserve every component
      for (const component of mo.components) {
        const product = await Product.findById(
          component.product
        ).session(session);

        product.stock.reserved +=
          component.requiredQuantity;

        await product.save({ session });

        await StockMovement.create(
          [
            {
              product: product._id,
              type: "RESERVATION",
              quantity: component.requiredQuantity,
              referenceType: "MANUFACTURING_ORDER",
              referenceId: mo._id,
              performedBy: userId,
              note: `Reserved for Manufacturing Order ${mo._id}`,
            },
          ],
          { session }
        );
      }

      mo.status = "CONFIRMED";

      updatedMO = await mo.save({ session });
    });

    return updatedMO;
  } finally {
    await session.endSession();
  }
}

export async function createWorkOrdersForMO({
  manufacturingOrderId,
}) {
  const mo = await ManufacturingOrder.findById(
    manufacturingOrderId
  );

  if (!mo) {
    throw new ApiError(
      404,
      "Manufacturing order not found"
    );
  }

  if (mo.status !== "CONFIRMED") {
    throw new ApiError(
      400,
      "Work orders can only be created for a confirmed manufacturing order"
    );
  }

  const existingWorkOrders = await WorkOrder.countDocuments({
    manufacturingOrder: mo._id,
  });

  if (existingWorkOrders > 0) {
    throw new ApiError(
      409,
      "Work orders already exist for this manufacturing order"
    );
  }

  const workOrders = mo.operations.map((operation) => ({
    manufacturingOrder: mo._id,
    name: operation.name,
    sequence: operation.sequence,
    durationMinutes: operation.durationMinutes,
    workCenter: operation.workCenter,
    status: "PENDING",
  }));

  return WorkOrder.insertMany(workOrders);
}