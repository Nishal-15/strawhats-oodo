import {
  createInventoryAdjustment,
} from "../services/inventoryAdjustmentService.js";

export async function createInventoryAdjustmentController(
  req,
  res
) {
  const {
    productId,
    quantity,
    reason,
  } = req.body;

  const adjustment =
    await createInventoryAdjustment({
      productId,
      quantity,
      reason,
      userId: req.user._id,
    });

  res.status(201).json({
    success: true,
    message:
      "Inventory adjusted successfully",
    adjustment,
  });
}