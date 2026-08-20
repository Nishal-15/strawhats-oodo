import { StockMovement } from "../models/StockMovement.js";

export async function getStockMovements(req, res) {
  const movements = await StockMovement.find()
    .populate("product", "sku name")
    .populate("performedBy", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    movements,
  });
}