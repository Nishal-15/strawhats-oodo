import {
  reserveStock,
  releaseStock,
  consumeStock,
} from "../services/inventoryService.js";
import { StockMovement } from "../models/StockMovement.js";

export async function reserve(req, res) {
  const { productId, quantity, referenceType, referenceId, note } = req.body;

  const product = await reserveStock({
    productId,
    quantity,
    userId: req.user._id,
    referenceType,
    referenceId,
    note,
  });

  res.json({
    success: true,
    message: "Stock reserved successfully",
    product,
  });
}

export async function release(req, res) {
  const { productId, quantity, referenceType, referenceId, note } = req.body;

  const product = await releaseStock({
    productId,
    quantity,
    userId: req.user._id,
    referenceType,
    referenceId,
    note,
  });

  res.json({
    success: true,
    message: "Stock released successfully",
    product,
  });
}

export async function consume(req, res) {
  const { productId, quantity, referenceType, referenceId, note } = req.body;

  const product = await consumeStock({
    productId,
    quantity,
    userId: req.user._id,
    referenceType,
    referenceId,
    note,
  });

  res.json({
    success: true,
    message: "Stock consumed successfully",
    product,
  });
}

export async function getMovements(req, res) {
  const movements = await StockMovement.find({
    product: req.params.productId,
  })
    .populate("product", "sku name")
    .populate("performedBy", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    movements,
  });
}