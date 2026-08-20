import { BoM } from "../models/BoM.js";
import { BoMComponent } from "../models/BoMComponent.js";
import { BoMOperation } from "../models/BoMOperation.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { WorkCenter } from "../models/WorkCenter.js";

export async function createBoM(req, res) {
  const {
    productId,
    quantity = 1,
    components = [],
    operations = [],
  } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product is required");
  }

  if (!Array.isArray(components) || components.length === 0) {
    throw new ApiError(400, "At least one component is required");
  }

  if (!Array.isArray(operations) || operations.length === 0) {
    throw new ApiError(400, "At least one operation is required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Finished product not found");
  }

  const existingBoM = await BoM.findOne({ product: productId });

  if (existingBoM) {
    throw new ApiError(
      409,
      "A BoM already exists for this product"
    );
  }

  const componentProductIds = components.map(
    (component) => component.productId
  );

  const componentProducts = await Product.find({
    _id: { $in: componentProductIds },
    active: true,
  });

  if (componentProducts.length !== componentProductIds.length) {
    throw new ApiError(
      400,
      "One or more component products do not exist"
    );
  }

  const bom = await BoM.create({
    product: productId,
    quantity,
  });

  try {
    const bomComponents = components.map((component) => ({
      bom: bom._id,
      product: component.productId,
      quantity: component.quantity,
    }));

    const bomOperations = operations.map((operation) => ({
      bom: bom._id,
      name: operation.name,
      durationMinutes: operation.durationMinutes,
      sequence: operation.sequence,
    }));

    await BoMComponent.insertMany(bomComponents);
    await BoMOperation.insertMany(bomOperations);

    const completeBoM = await getCompleteBoM(bom._id);

    res.status(201).json({
      success: true,
      message: "BoM created successfully",
      bom: completeBoM,
    });
  } catch (error) {
    await BoM.findByIdAndDelete(bom._id);
    await BoMComponent.deleteMany({ bom: bom._id });
    await BoMOperation.deleteMany({ bom: bom._id });

    throw error;
  }
}

async function getCompleteBoM(bomId) {
  const bom = await BoM.findById(bomId)
    .populate("product", "sku name");

  if (!bom) {
    throw new ApiError(404, "BoM not found");
  }

  const components = await BoMComponent.find({
    bom: bomId,
  })
    .populate("product", "sku name");

  const operations = await BoMOperation.find({
  bom: bom._id,
})
  .populate("workCenter", "name location")
  .sort({ sequence: 1 });

  return {
    ...bom.toObject(),
    components,
    operations,
  };
}

export async function getBoMs(req, res) {
  const boms = await BoM.find({ active: true })
    .populate("product", "sku name")
    .sort({ createdAt: -1 });

  const result = await Promise.all(
    boms.map(async (bom) => {
      const components = await BoMComponent.find({
        bom: bom._id,
      }).populate("product", "sku name");

    const operations = await BoMOperation.find({
  bom: bom._id,
})
  .populate("workCenter", "name location")
  .sort({ sequence: 1 });

      return {
        ...bom.toObject(),
        components,
        operations,
      };
    })
  );

  res.json({
    success: true,
    boms: result,
  });
}

export async function assignWorkCenters(req, res) {
  const { operations } = req.body;

  if (!Array.isArray(operations) || operations.length === 0) {
    throw new ApiError(
      400,
      "Operations are required"
    );
  }

  for (const operation of operations) {
    if (!operation.operationId || !operation.workCenterId) {
      throw new ApiError(
        400,
        "Each operation requires operationId and workCenterId"
      );
    }

    const workCenter = await WorkCenter.findOne({
      _id: operation.workCenterId,
      active: true,
    });

    if (!workCenter) {
      throw new ApiError(
        404,
        `Work center not found: ${operation.workCenterId}`
      );
    }

    const updatedOperation = await BoMOperation.findByIdAndUpdate(
      operation.operationId,
      {
        workCenter: operation.workCenterId,
      },
      {
        new: true,
      }
    );

    if (!updatedOperation) {
      throw new ApiError(
        404,
        `Operation not found: ${operation.operationId}`
      );
    }
  }

  const bomId = (
    await BoMOperation.findById(operations[0].operationId)
  ).bom;

  const completeBoM = await getCompleteBoM(bomId);

  res.json({
    success: true,
    message: "Work centers assigned successfully",
    bom: completeBoM,
  });
}