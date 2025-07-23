import Project from "../models/Project.js";
import cloudinary from "../utils/cloudinary.js";
import errorHandler from "../utils/errorHandler.js";

export const createProject = async (req, res) => {
  try {
    const { name, description,duration, note } = req.body;

    let imageUrls = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }
    }

    const newProject = await Project.create({
      name,
      description,
      note,
      duration,
      user: req.user._id,
      images: imageUrls,
    });

    res
      .status(201)
      .json({ message: "Project created successfully", newProject });
  } catch (error) {
    errorHandler({ message: "Project creation failed" }, error, req, res);
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("user");
    res.status(200).json(projects);
  } catch (error) {
    errorHandler({ message: "Failed to fetch projects" }, error, req, res);
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("user");
    if (!project) throw new Error("Project not found");
    res.status(200).json(project);
  } catch (error) {
    errorHandler({ message: "Failed to fetch project" }, error, req, res);
  }
};

export const updateProject = async (req, res) => {
  try {
    const { name, description,duration, note } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) throw new Error("Project not found");
    if (project.user.toString() !== req.user._id.toString()) {
      throw new Error("Not authorized to update this project");
    }

    let imageUrls = [...project.images];
    if (req.files) {
      // Check if adding new files would exceed the 5 image limit
      if (imageUrls.length + req.files.length > 5) {
        throw new Error("Cannot exceed 5 images per project");
      }

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, note,duration, images: imageUrls },
      { new: true }
    );

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    errorHandler({ message: "Project update failed" }, error, req, res);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new Error("Project not found");
    if (project.user.toString() !== req.user._id.toString()) {
      throw new Error("Not authorized to delete this project");
    }

    for (const image of project.images) {
      const publicId = image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    errorHandler({ message: "Project deletion failed" }, error, req, res);
  }
};

export const removeImage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { imageUrl } = req.body;

    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");
    if (project.user.toString() !== req.user._id.toString()) {
      throw new Error("Not authorized to modify this project");
    }

    // Remove image from project
    project.images = project.images.filter((img) => img !== imageUrl);
    await project.save();

    // Delete image from Cloudinary
    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ message: "Image removed successfully", project });
  } catch (error) {
    errorHandler({ message: "Failed to remove image" }, error, req, res);
  }
};
