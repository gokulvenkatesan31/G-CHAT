import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoUri = process.env.MONGO_URI;
// console.log(mongoUri);
const connectDB = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("mongodb connected successfully");
    })
    .catch((e) => {
      console.log("mongo error" + e);
    });
};

export default connectDB;
