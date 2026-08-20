import { SalesOrder } from "../models/SalesOrder.js";
import { Customer } from "../models/Customer.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import {
  confirmSalesOrder,
  deliverSalesOrder,
} from "../services/salesOrderService.js";

export async function createSalesOrder(req, res) {
  const { customerId, items } = req.body;

  if (!customerId) {
    throw new ApiError(400, "Customer is required");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "At least one product is required");
  }

  const customer = await Customer.findOne({
    _id: customerId,
    active: true,
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    if (!item.productId || !item.quantity || item.quantity <= 0) {
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

    const unitPrice = product.salesPrice;
    const totalPrice = unitPrice * item.quantity;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
    });

    totalAmount += totalPrice;
  }

  const salesOrder = await SalesOrder.create({
    customer: customer._id,
    items: orderItems,
    totalAmount,
    status: "DRAFT",
    createdBy: req.user._id,
  });

  const result = await SalesOrder.findById(
    salesOrder._id
  )
    .populate("customer", "name email phone")
    .populate("items.product", "sku name salesPrice")
    .populate("createdBy", "name email");

  res.status(201).json({
    success: true,
    message: "Sales order created successfully",
    salesOrder: result,
  });
}

export async function confirmSalesOrderController(
  req,
  res
) {
  const { id } = req.params;

  const salesOrder = await confirmSalesOrder({
    salesOrderId: id,
    userId: req.user._id,
  });

  res.json({
    success: true,
    message:
      "Sales order confirmed and stock reserved successfully",
    salesOrder,
  });
}

export async function deliverSalesOrderController(
  req,
  res
) {
  const { id } = req.params;

  const salesOrder = await deliverSalesOrder({
    salesOrderId: id,
    userId: req.user._id,
  });

  res.json({
    success: true,
    message:
      "Sales order delivered successfully",
    salesOrder,
  });
}