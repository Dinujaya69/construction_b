import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import errorHandler from "./utils/errorHandler.js";

import userRoutes from "./routes/user.Routes.js";
import projectRoutes from "./routes/project.Routes.js";

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);


app.use(errorHandler);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
