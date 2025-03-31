import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", upload.array("images", 5), updateProject);
router.delete("/:id", deleteProject);

export default router;
