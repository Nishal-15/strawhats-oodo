import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().default(""),
  salesPrice: z.number().nonnegative(),
  costPrice: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative().default(0),
  procurementStrategy: z.enum(["MTS", "MTO"]).default("MTS"),
  procurementType: z.enum(["PURCHASE", "MANUFACTURE"]).default("PURCHASE"),
  vendorName: z.string().trim().max(160).optional().default(""),
});
