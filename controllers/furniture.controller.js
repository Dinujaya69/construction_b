import Furniture from "../models/Furniture.js";
import cloudinary from "../utils/cloudinary.js";
import errorHandler from "../utils/errorHandler.js";


export const createFurniture = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    let imageUrls = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }
    }

    const newFurniture = new Furniture({
      name,
      description,
      price,
      category,
      images: imageUrls,
    });
    const savedFurniture = await newFurniture.save();

    res.status(201).json({
      success: true,
      message: "Furniture created successfully",
      data: savedFurniture,
    });
  } catch (error) {
    errorHandler({ message: "Furniture creation failed" }, error, req, res);
  }
};


export const getAllFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.find();
    res.status(200).json({
      success: true,
      count: furniture.length,
      data: furniture,
    });
  } catch (error) {
    errorHandler(
      { message: "Failed to fetch furniture items" },
      error,
      req,
      res
    );
  }
};


export const getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) {
      throw new Error("Furniture not found");
    }
    res.status(200).json({ success: true, data: furniture });
  } catch (error) {
    errorHandler({ message: "Failed to fetch furniture" }, error, req, res);
  }
};


export const updateFurniture = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let furniture = await Furniture.findById(req.params.id);

    if (!furniture) throw new Error("Furniture not found");

    let imageUrls = furniture.images;
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }
    }

    furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, images: imageUrls },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Furniture updated successfully",
      data: furniture,
    });
  } catch (error) {
    errorHandler({ message: "Furniture update failed" }, error, req, res);
  }
};

export const deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) throw new Error("Furniture not found");

    for (const image of furniture.images) {
      const publicId = image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await furniture.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Furniture deleted successfully" });
  } catch (error) {
    errorHandler({ message: "Furniture deletion failed" }, error, req, res);
  }
};

export const addSubFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (!furniture) throw new Error("Furniture not found");

    const newSubFurniture = {
      ...req.body,
      subFurnitureID: `subFurniture${Date.now()}`, 
    };

    furniture.subFurniture.push(newSubFurniture);
    await furniture.save();

    res.status(200).json({
      success: true,
      message: "SubFurniture added successfully",
      data: furniture,
    });
  } catch (error) {
    errorHandler({ message: "Failed to add SubFurniture" }, error, req, res);
  }
};


export const updateSubFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.furnitureId);
    if (!furniture) throw new Error("Furniture not found");

    const subFurnitureIndex = furniture.subFurniture.findIndex(
      (item) => item.subFurnitureID === req.params.subFurnitureId
    );
    if (subFurnitureIndex === -1) throw new Error("SubFurniture not found");

    Object.keys(req.body).forEach((key) => {
      furniture.subFurniture[subFurnitureIndex][key] = req.body[key];
    });

    await furniture.save();
    res.status(200).json({
      success: true,
      message: "SubFurniture updated successfully",
      data: furniture,
    });
  } catch (error) {
    errorHandler({ message: "Failed to update SubFurniture" }, error, req, res);
  }
};

export const deleteSubFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.furnitureId);
    if (!furniture) throw new Error("Furniture not found");

    const subFurnitureIndex = furniture.subFurniture.findIndex(
      (item) => item.subFurnitureID === req.params.subFurnitureId
    );
    if (subFurnitureIndex === -1) throw new Error("SubFurniture not found");

    furniture.subFurniture.splice(subFurnitureIndex, 1);
    await furniture.save();

    res.status(200).json({
      success: true,
      message: "SubFurniture deleted successfully",
      data: furniture,
    });
  } catch (error) {
    errorHandler({ message: "Failed to delete SubFurniture" }, error, req, res);
  }
};
