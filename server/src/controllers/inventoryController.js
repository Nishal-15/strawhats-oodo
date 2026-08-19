import {
  reserveStock,
  releaseStock,
  consumeStock,
} from "../services/inventoryService.js";

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