import { ManufacturingOrder } from "../models/ManufacturingOrder.js";
import { Product } from "../models/Product.js";
import { BoM } from "../models/BoM.js";
import { BoMComponent } from "../models/BoMComponent.js";
import { BoMOperation } from "../models/BoMOperation.js";
import { ApiError } from "../utils/ApiError.js";
import {
  confirmManufacturingOrder,
  createWorkOrdersForMO,
} from "../services/manufacturingService.js";

export async function createManufacturingOrder(req, res) {
  const { productId, quantity } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product is required");
  }

  if (!quantity || quantity <= 0) {
    throw new ApiError(
      400,
      "Manufacturing quantity must be greater than zero"
    );
  }

  // 1. Find the finished product
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // 2. Find the active BoM
  const bom = await BoM.findOne({
    product: productId,
    active: true,
  });

  if (!bom) {
    throw new ApiError(
      404,
      "No active BoM exists for this product"
    );
  }

  // 3. Get BoM components
  const bomComponents = await BoMComponent.find({
    bom: bom._id,
  }).populate("product", "sku name");

  if (bomComponents.length === 0) {
    throw new ApiError(
      400,
      "BoM has no components"
    );
  }

  // 4. Calculate required component quantities
  const components = bomComponents.map((component) => ({
    product: component.product._id,
    requiredQuantity:
      component.quantity * quantity,
  }));

  // 5. Get BoM operations
  const bomOperations = await BoMOperation.find({
    bom: bom._id,
  })
    .populate("workCenter", "name location")
    .sort({ sequence: 1 });

  if (bomOperations.length === 0) {
    throw new ApiError(
      400,
      "BoM has no operations"
    );
  }

  // 6. Copy operations into the MO
  const operations = bomOperations.map((operation) => ({
    name: operation.name,
    durationMinutes: operation.durationMinutes,
    sequence: operation.sequence,
    workCenter: operation.workCenter._id,
    status: "PENDING",
  }));

  // 7. Create Manufacturing Order
  const manufacturingOrder =
    await ManufacturingOrder.create({
      product: productId,
      bom: bom._id,
      quantity,
      status: "DRAFT",
      components,
      operations,
      createdBy: req.user._id,
    });

  const result =
    await ManufacturingOrder.findById(
      manufacturingOrder._id
    )
      .populate("product", "sku name")
      .populate("bom")
      .populate("components.product", "sku name")
      .populate(
        "operations.workCenter",
        "name location"
      )
      .populate("createdBy", "name email");

  res.status(201).json({
    success: true,
    message:
      "Manufacturing order created successfully",
    manufacturingOrder: result,
  });
}

export async function confirmManufacturingOrderController(
  req,
  res
) {
  const { id } = req.params;

  const manufacturingOrder =
    await confirmManufacturingOrder({
      manufacturingOrderId: id,
      userId: req.user._id,
    });

  res.json({
    success: true,
    message:
      "Manufacturing order confirmed and components reserved successfully",
    manufacturingOrder,
  });
}

export async function createWorkOrdersController(
  req,
  res
) {
  const { id } = req.params;

  const workOrders =
    await createWorkOrdersForMO({
      manufacturingOrderId: id,
    });

  res.status(201).json({
    success: true,
    message: "Work orders created successfully",
    workOrders,
  });
}