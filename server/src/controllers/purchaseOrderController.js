import { PurchaseOrder } from "../models/PurchaseOrder.js";
import { Supplier } from "../models/Supplier.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import {
  confirmPurchaseOrder,
  receivePurchaseOrder,
} from "../services/purchaseOrderService.js";

export async function createPurchaseOrder(req, res) {
  const { supplierId, items } = req.body;

  if (!supplierId) {
    throw new ApiError(400, "Supplier is required");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(
      400,
      "At least one product is required"
    );
  }

  const supplier = await Supplier.findOne({
    _id: supplierId,
    active: true,
  });

  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    if (
      !item.productId ||
      !item.quantity ||
      item.quantity <= 0
    ) {
      throw new ApiError(
        400,
        "Each item requires productId and a valid quantity"
      );
    }

    const product = await Product.findOne({
      _id: item.productId,
      active: true,
    });

    if (!product) {
      throw new ApiError(
        404,
        `Product not found: ${item.productId}`
      );
    }

    const unitCost = product.costPrice;
    const totalCost = unitCost * item.quantity;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      unitCost,
      totalCost,
    });

    totalAmount += totalCost;
  }

  const purchaseOrder = await PurchaseOrder.create({
    supplier: supplier._id,
    items: orderItems,
    totalAmount,
    status: "DRAFT",
    createdBy: req.user._id,
  });

  const result = await PurchaseOrder.findById(
    purchaseOrder._id
  )
    .populate("supplier", "name email phone")
    .populate(
      "items.product",
      "sku name costPrice"
    )
    .populate("createdBy", "name email");

  res.status(201).json({
    success: true,
    message: "Purchase order created successfully",
    purchaseOrder: result,
  });
}

export async function confirmPurchaseOrderController(
  req,
  res
) {
  const { id } = req.params;

  const purchaseOrder = await confirmPurchaseOrder({
    purchaseOrderId: id,
  });

  res.json({
    success: true,
    message: "Purchase order confirmed successfully",
    purchaseOrder,
  });
}

export async function receivePurchaseOrderController(
  req,
  res
) {
  const { id } = req.params;

  const purchaseOrder = await receivePurchaseOrder({
    purchaseOrderId: id,
    userId: req.user._id,
  });

  res.json({
    success: true,
    message:
      "Purchase order received and inventory updated successfully",
    purchaseOrder,
  });
}

export async function getPurchaseOrders(req, res) {
  const purchaseOrders = await PurchaseOrder.find()
    .populate(
      "supplier",
      "name email phone"
    )
    .populate(
      "items.product",
      "sku name costPrice"
    )
    .populate(
      "createdBy",
      "name email"
    )
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    purchaseOrders,
  });
}