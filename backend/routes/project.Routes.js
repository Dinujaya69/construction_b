import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  removeImage,
} from "../controllers/project.controller.js";
import upload from "../middlewares/multer.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.array("images", 5), createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", protect, upload.array("images", 5), updateProject);
router.delete("/:id", protect, deleteProject);
router.patch("/:projectId/remove-image", protect, removeImage);

export default router;
