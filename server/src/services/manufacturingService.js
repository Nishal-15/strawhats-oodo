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

export async function completeManufacturingOrder({
  manufacturingOrderId,
  userId,
}) {
  const session = await mongoose.startSession();

  try {
    let completedMO;

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

      if (mo.status !== "IN_PROGRESS") {
        throw new ApiError(
          400,
          `Cannot complete MO in ${mo.status} status`
        );
      }

      const workOrders = await WorkOrder.find({
        manufacturingOrder: mo._id,
      })
        .sort({ sequence: 1 })
        .session(session);

      if (workOrders.length === 0) {
        throw new ApiError(
          400,
          "No work orders found"
        );
      }

      const incompleteWorkOrder = workOrders.find(
        (workOrder) =>
          workOrder.status !== "COMPLETED"
      );

      if (incompleteWorkOrder) {
        throw new ApiError(
          400,
          `Work order "${incompleteWorkOrder.name}" is not completed`
        );
      }

      // Consume components
      for (const component of mo.components) {
        const product = await Product.findById(
          component.product
        ).session(session);

        if (!product) {
          throw new ApiError(
            404,
            "Component product not found"
          );
        }

        const quantity = component.requiredQuantity;

        if (product.stock.reserved < quantity) {
          throw new ApiError(
            400,
            `Reserved stock is insufficient for ${product.name}`
          );
        }

        if (product.stock.onHand < quantity) {
          throw new ApiError(
            400,
            `On-hand stock is insufficient for ${product.name}`
          );
        }

        product.stock.onHand -= quantity;
        product.stock.reserved -= quantity;

        await product.save({ session });

        await StockMovement.create(
          [
            {
              product: product._id,
              type: "CONSUMPTION",
              quantity,
              referenceType: "MANUFACTURING_ORDER",
              referenceId: mo._id,
              performedBy: userId,
              note: `Consumed for Manufacturing Order ${mo._id}`,
            },
          ],
          { session }
        );
      }

      // Produce finished goods
      const finishedProduct = await Product.findById(
        mo.product
      ).session(session);

      if (!finishedProduct) {
        throw new ApiError(
          404,
          "Finished product not found"
        );
      }

      finishedProduct.stock.onHand += mo.quantity;

      await finishedProduct.save({ session });

      await StockMovement.create(
        [
          {
            product: finishedProduct._id,
            type: "PRODUCTION",
            quantity: mo.quantity,
            referenceType: "MANUFACTURING_ORDER",
            referenceId: mo._id,
            performedBy: userId,
            note: `Produced from Manufacturing Order ${mo._id}`,
          },
        ],
        { session }
      );

      mo.operations = mo.operations.map((operation) => ({
        ...operation.toObject(),
        status: "COMPLETED",
}));

    mo.status = "COMPLETED";

    completedMO = await mo.save({ session });
    });

    return completedMO;
  } finally {
    await session.endSession();
  }
}