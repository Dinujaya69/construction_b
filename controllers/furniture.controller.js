import Furniture from "../models/Furniture.js";
import cloudinary from "../utils/cloudinary.js";
import errorHandler from "../utils/errorHandler.js";

export const createFurniture = async (req, res) => {
  try {
    const { name } = req.body;

    const newFurniture = new Furniture({
      name,
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
    const { name } = req.body;
    let furniture = await Furniture.findById(req.params.id);

    if (!furniture) throw new Error("Furniture not found");

    furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      { name },
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

    // Delete all subFurniture images first
    for (const subItem of furniture.subFurniture) {
      if (subItem.subFurnitureImage) {
        const publicId = subItem.subFurnitureImage
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
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

    const { subFurnitureName, subFurniturePrice, subFurnitureQuantity } =
      req.body;

    if (!req.file) {
      throw new Error("SubFurniture image is required");
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const newSubFurniture = {
      subFurnitureName,
      subFurniturePrice,
      subFurnitureQuantity,
      subFurnitureID: `subFurniture${Date.now()}`,
      subFurnitureImage: result.secure_url,
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

    // Update basic fields
    if (req.body.subFurnitureName) {
      furniture.subFurniture[subFurnitureIndex].subFurnitureName =
        req.body.subFurnitureName;
    }
    if (req.body.subFurniturePrice) {
      furniture.subFurniture[subFurnitureIndex].subFurniturePrice =
        req.body.subFurniturePrice;
    }
    if (req.body.subFurnitureQuantity) {
      furniture.subFurniture[subFurnitureIndex].subFurnitureQuantity =
        req.body.subFurnitureQuantity;
    }

    // Handle image upload if provided
    if (req.file) {
      // Delete old image if exists
      if (furniture.subFurniture[subFurnitureIndex].subFurnitureImage) {
        const publicId = furniture.subFurniture[
          subFurnitureIndex
        ].subFurnitureImage
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);
      furniture.subFurniture[subFurnitureIndex].subFurnitureImage =
        result.secure_url;
    }

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

    // Delete the subFurniture image from cloudinary
    if (furniture.subFurniture[subFurnitureIndex].subFurnitureImage) {
      const publicId = furniture.subFurniture[
        subFurnitureIndex
      ].subFurnitureImage
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

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
