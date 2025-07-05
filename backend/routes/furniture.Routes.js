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
import upload from "../middlewares/multer.js";

const router = express.Router();

// Main furniture routes - no image upload needed
router.post("/", createFurniture);
router.get("/", getAllFurniture);
router.get("/:id", getFurnitureById);
router.put("/:id", updateFurniture);
router.delete("/:id", deleteFurniture);

// SubFurniture routes - image upload only for these
router.post(
  "/:id/subFurniture",
  upload.single("subFurnitureImage"),
  addSubFurniture
);
router.put(
  "/:furnitureId/subFurniture/:subFurnitureId",
  upload.single("subFurnitureImage"),
  updateSubFurniture
);
router.delete("/:furnitureId/subFurniture/:subFurnitureId", deleteSubFurniture);

export default router;
