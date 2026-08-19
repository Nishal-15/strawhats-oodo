import { Product } from "../models/Product.js";
import { createProductSchema } from "../validators/product.js";

export async function createProduct(req, res) {
  const data = createProductSchema.parse(req.body);

  const product = await Product.create({
    ...data,
    sku: data.sku.toUpperCase(),
    stock: {
      onHand: data.stockQuantity,
      reserved: 0,
    },
  });

  res.status(201).json({
    success: true,
    product,
  });
}

export async function listProducts(req, res) {
  const products = await Product.find({ active: true }).sort({ createdAt: -1 });

  res.json({
    success: true,
    products,
  });
}

export async function getProduct(req, res) {
  const product = await Product.findOne({ _id: req.params.id, active: true });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.json({
    success: true,
    product,
  });
}
