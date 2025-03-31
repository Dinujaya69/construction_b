import express from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { getAllUsers, getUserById, updateUserById, deleteUserById } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export default router;