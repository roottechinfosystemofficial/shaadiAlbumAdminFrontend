import { ClientViewUser } from "../model/ClientViewUser.model.js";
import jwt from "jsonwebtoken";
import EventModel from "../model/Event.model.js";
import { User } from "../model/User.model.js";

export const newClientViewUser = async (req, res) => {
  const { name, email, phone, eventId,userId,eventName} = req.body;

  try {
    // Check if all required fields are provided
    if (!name || !email || !phone || !eventId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser=await User.find({_id:userId})

    if(!existingUser){
      return res.status(400).json({ message: "User Not Found" });


    }

    // Create a new client view user
    const newClient = new ClientViewUser({
      name,
      email,
      phone,
      eventId,
      userId,
      eventName
      
    });

    
    await User.findByIdAndUpdate(userId, { $inc: { totalUsers: 1 } });


    await newClient.save();
    const clientViewToken = jwt.sign(
      {
        userId: newClient._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(201).json({
      message: "Client registered successfully!",
      token: clientViewToken,
      data: newClient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while creating the client.",
      error: error.message,
    });
  }
};

export const getAllClientViewUsers = async (req, res) => {
  try {
    
      const param=req.params;

     console.log("hitted params",param)
    const users = await ClientViewUser.find({
      userId:param?.userId
    })
    
      


    return res.status(200).json({
      message: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching the users.",
      error: error.message,
    });
  }
};

export const verifyClientToken = (req, res) => {
  try {
    const token = req.body.clientViewToken;

    // Validate input
    if (!token) {
      return res.status(400).json({ message: "Client token is required." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check if decoded contains required fields
    if (!decoded) {
      return res.status(403).json({ message: "Invalid token ." });
    }

    return res.status(200).json({
      message: "Client is already registered.",
      userId: decoded.userId,
      showForm: false,
    });
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
