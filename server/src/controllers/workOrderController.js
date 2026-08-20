import {
  startWorkOrder,
  completeWorkOrder,
} from "../services/workOrderService.js";

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