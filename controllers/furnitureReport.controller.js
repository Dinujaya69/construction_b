import FurnitureReport from "../models/FurnitureReport.js";
import Furniture from "../models/Furniture.js";

// Generate daily report based on current furniture inventory
export const generateDailyReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if report already exists for today
    const existingReport = await FurnitureReport.findOne({ date: today });
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "Report for today already exists",
        data: existingReport,
      });
    }

    // Get all furniture with subFurniture
    const allFurniture = await Furniture.find();
    const reportItems = [];

    allFurniture.forEach((furniture) => {
      furniture.subFurniture.forEach((subItem) => {
        reportItems.push({
          furnitureId: furniture._id,
          subFurnitureId: subItem.subFurnitureID,
          itemName: `${furniture.name} - ${subItem.subFurnitureName}`,
          itemNo: subItem.subFurnitureID,
          initialCount: subItem.subFurnitureQuantity,
          sold: 0,
          remaining: subItem.subFurnitureQuantity,
        });
      });
    });

    const newReport = new FurnitureReport({
      date: today,
      reportItems,
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: "Daily report generated successfully",
      data: newReport,
    });
  } catch (error) {
    console.error("Generate report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate daily report",
      error: error.message,
    });
  }
};

// Get today's report
export const getTodayReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await FurnitureReport.findOne({ date: today });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No report found for today",
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Get today report error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's report",
      error: error.message,
    });
  }
};

// Get report by date
export const getReportByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const reportDate = new Date(date);
    reportDate.setHours(0, 0, 0, 0);

    const report = await FurnitureReport.findOne({ date: reportDate });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No report found for the specified date",
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Get report by date error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};

// Update sold items in today's report
export const updateSoldItems = async (req, res) => {
  try {
    const { itemUpdates } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await FurnitureReport.findOne({ date: today });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No report found for today",
      });
    }

    // Update sold quantities and calculate remaining
    itemUpdates.forEach((update) => {
      const reportItem = report.reportItems.find(
        (item) => item.subFurnitureId === update.subFurnitureId
      );

      if (reportItem) {
        reportItem.sold = update.soldQuantity;
        reportItem.remaining = reportItem.initialCount - update.soldQuantity;
      }
    });

    await report.save();

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Update sold items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update report",
      error: error.message,
    });
  }
};

// Get all reports with pagination
export const getAllReports = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await FurnitureReport.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FurnitureReport.countDocuments();

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get all reports error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

// Add signature to report
export const addSignature = async (req, res) => {
  try {
    const { signature } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await FurnitureReport.findOneAndUpdate(
      { date: today },
      { signature },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No report found for today",
      });
    }

    res.status(200).json({
      success: true,
      message: "Signature added successfully",
      data: report,
    });
  } catch (error) {
    console.error("Add signature error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add signature",
      error: error.message,
    });
  }
};
