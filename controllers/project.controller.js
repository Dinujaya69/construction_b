import Project from "../models/Project.js";
import cloudinary from "../utils/cloudinary.js";
import errorHandler from "../utils/errorHandler.js";


export const createProject = async (req, res) => {
  try {
    const { name, description, user, note } = req.body;

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
      user,
      note,
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
    const { name, description, user, note } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) throw new Error("Project not found");

    let imageUrls = project.images;
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, user, note, images: imageUrls },
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
