import express from "express";
import {
  generateDailyReport,
  getTodayReport,
  getReportByDate,
  updateSoldItems,
  getAllReports,
  addSignature,
} from "../controllers/furnitureReport.controller.js";

const router = express.Router();

// Test route to verify API is working
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Furniture reports API is working!" });
});

// Generate daily report
router.post("/generate", generateDailyReport);

// Get today's report
router.get("/today", getTodayReport);

// Get report by date
router.get("/date/:date", getReportByDate);

// Update sold items
router.put("/update-sold", updateSoldItems);

// Get all reports with pagination
router.get("/", getAllReports);

// Add signature to today's report
router.put("/signature", addSignature);

export default router;
