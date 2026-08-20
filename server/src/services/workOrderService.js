import { WorkOrder } from "../models/WorkOrder.js";
import { ManufacturingOrder } from "../models/ManufacturingOrder.js";
import { ApiError } from "../utils/ApiError.js";

export async function startWorkOrder(workOrderId) {
  const workOrder = await WorkOrder.findById(workOrderId);

  if (!workOrder) {
    throw new ApiError(404, "Work order not found");
  }

  if (workOrder.status !== "PENDING") {
    throw new ApiError(
      400,
      `Cannot start work order in ${workOrder.status} status`
    );
  }

  const previousWorkOrder = await WorkOrder.findOne({
    manufacturingOrder: workOrder.manufacturingOrder,
    sequence: workOrder.sequence - 1,
  });

  if (previousWorkOrder && previousWorkOrder.status !== "COMPLETED") {
    throw new ApiError(
      400,
      `Previous work order "${previousWorkOrder.name}" must be completed first`
    );
  }

  const mo = await ManufacturingOrder.findById(
    workOrder.manufacturingOrder
  );

  if (!mo) {
    throw new ApiError(
      404,
      "Manufacturing order not found"
    );
  }

  if (mo.status !== "CONFIRMED" && mo.status !== "IN_PROGRESS") {
    throw new ApiError(
      400,
      `Cannot start work order when manufacturing order is ${mo.status}`
    );
  }

  workOrder.status = "IN_PROGRESS";
  workOrder.startedAt = new Date();

  await workOrder.save();

  if (mo.status === "CONFIRMED") {
    mo.status = "IN_PROGRESS";
    await mo.save();
  }

  return workOrder;
}

export async function completeWorkOrder(workOrderId) {
  const workOrder = await WorkOrder.findById(workOrderId);

  if (!workOrder) {
    throw new ApiError(404, "Work order not found");
  }

  if (workOrder.status !== "IN_PROGRESS") {
    throw new ApiError(
      400,
      `Cannot complete work order in ${workOrder.status} status`
    );
  }

  workOrder.status = "COMPLETED";
  workOrder.completedAt = new Date();

  await workOrder.save();

  return workOrder;
}