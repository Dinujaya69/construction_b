import mongoose from "mongoose";

const { Schema, model } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    projectID: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate Project ID
projectSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const count = await this.model("Project").countDocuments();
  this.projectID = `project${count + 1}`;
  next();
});

const Project = model("Project", projectSchema);

export default Project;
