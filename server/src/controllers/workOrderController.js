import {
  startWorkOrder,
  completeWorkOrder,
} from "../services/workOrderService.js";

import { WorkOrder } from "../models/WorkOrder.js";

export async function getWorkOrders(req, res) {
  const workOrders = await WorkOrder.find()
    .populate(
      "manufacturingOrder",
      "product quantity status"
    )
    .populate(
      "workCenter",
      "name location"
    )
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    workOrders,
  });
}

export async function startWorkOrderController(req, res) {
  const { id } = req.params;

  const workOrder = await startWorkOrder(id);

  res.json({
    success: true,
    message: "Work order started successfully",
    workOrder,
  });
}

export async function completeWorkOrderController(req, res) {
  const { id } = req.params;

  const workOrder = await completeWorkOrder(id);

  res.json({
    success: true,
    message: "Work order completed successfully",
    workOrder,
  });
}