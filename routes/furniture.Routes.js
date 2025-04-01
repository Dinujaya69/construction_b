import express from "express";
import {
  createFurniture,
  getAllFurniture,
  getFurnitureById,
  updateFurniture,
  deleteFurniture,
  addSubFurniture,
  updateSubFurniture,
  deleteSubFurniture,
} from "../controllers/furniture.controller.js";

const router = express.Router();

// Main furniture routes
router.post("/", createFurniture);
router.get("/", getAllFurniture);
router.get("/:id", getFurnitureById);
router.put("/:id", updateFurniture);
router.delete("/:id", deleteFurniture);

// SubFurniture routes
router.post("/:id/subFurniture", addSubFurniture);
router.put("/:furnitureId/subFurniture/:subFurnitureId", updateSubFurniture);
router.delete("/:furnitureId/subFurniture/:subFurnitureId", deleteSubFurniture);

export default router;
