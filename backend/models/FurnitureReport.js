import mongoose from "mongoose";

const { Schema, model } = mongoose;

const dailyReportSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    reportItems: [
      {
        furnitureId: {
          type: Schema.Types.ObjectId,
          ref: "Furniture",
          required: true,
        },
        subFurnitureId: {
          type: String,
          required: true,
        },
        itemName: {
          type: String,
          required: true,
        },
        itemNo: {
          type: String,
          required: true,
        },
        initialCount: {
          type: Number,
          required: true,
        },
        sold: {
          type: Number,
          default: 0,
        },
        remaining: {
          type: Number,
          required: true,
        },
      },
    ],
    signature: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one report per day
dailyReportSchema.index({ date: 1 }, { unique: true });

const FurnitureReport = model("FurnitureReport", dailyReportSchema);
export default FurnitureReport;
