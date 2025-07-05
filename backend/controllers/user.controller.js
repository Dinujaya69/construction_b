import User from "../models/User.js";
import generateToken from "../utils/jwtToken.js";
import errorHandler from "../utils/errorHandler.js";

export const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.create({ name, email, password });
      const token = generateToken(user._id);
      res.status(201).json({"message": "User registered successfully",user, token });
    } catch (error) {
      errorHandler({ message: "User registered failed" }, error, req, res);
    }
  };

  export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }
      const token = generateToken(user._id);
      res.status(200).json({"message": "User logged in successfully",user, token });
    } catch (error) {
      errorHandler({ message: "User login failed" }, error, req, res);
    }
  };

  export const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      errorHandler({ message: "User not found" }, error, req, res);
    }
  };

  export const updateUserById = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      errorHandler({ message: "User not found" }, error, req, res);
    }
  };

  export const deleteUserById = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      errorHandler({ message: "User not found" }, error, req, res);
    }
  };

  export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      errorHandler({ message: "Users not found" }, error, req, res);
    }
  };

