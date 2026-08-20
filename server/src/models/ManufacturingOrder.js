import mongoose from "mongoose";

const manufacturingOrderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    bom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoM",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.0001,
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "CONFIRMED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "DRAFT",
    },

    components: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        requiredQuantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    operations: [
      {
        name: {
          type: String,
          required: true,
        },

        durationMinutes: {
          type: Number,
          required: true,
          min: 0,
        },

        sequence: {
          type: Number,
          required: true,
        },

        workCenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "WorkCenter",
          required: true,
        },

        status: {
          type: String,
          enum: [
            "PENDING",
            "IN_PROGRESS",
            "COMPLETED",
          ],
          default: "PENDING",
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ManufacturingOrder = mongoose.model(
  "ManufacturingOrder",
  manufacturingOrderSchema
);