import User from "../models/User.model.js";
import Message from "../models/Message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getSocketIdFromUser } from "../lib/socket.js";
export const getUserForSidebar = async (req, res) => {
  const loggedInUserId = req.userId;
  const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
    "-password -__v"
  );
  res.status(200).json(users);
};

export const getMessages = async (req, res) => {
  const loggedInUserId = req.userId;
  const otherUserId = req.params.id;
  const messages = await Message.find({
    $or: [
      { sender: loggedInUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: loggedInUserId },
    ],
  });
  res.status(200).json(messages);
};

export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const loggedInUserId = req.userId;
  const otherUserId = req.params.id;
  let imageUrl = "";
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "messages",
    });
    imageUrl = result.secure_url;
  }
  const newMessage = new Message({
    sender: loggedInUserId,
    receiver: otherUserId,
    text,
    image: imageUrl,
  });
  await newMessage.save();
  const receiverSocketId = getSocketIdFromUser(otherUserId);
  if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);
  res.status(201).json(newMessage);
};
