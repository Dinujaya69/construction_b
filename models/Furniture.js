import mongoose from "mongoose";

const { Schema, model } = mongoose;

const furnitureSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  subFurniture: [
    {
      subFurnitureName: {
        type: String,
        required: [true, "Name is required"],
      },
      subFurnitureID: {
        type: String,
        unique: true,
      },
      subFurnitureImage: {
        type: String,
        required: [true, "Image is required"],
      },
      subFurniturePrice: {
        type: Number,
        required: [true, "Price is required"],
      },
      subFurnitureQuantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
    },
  ],
});

const Furniture = model("Furniture", furnitureSchema);

export default Furniture;
