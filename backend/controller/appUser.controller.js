import { AppUser } from "../model/AppUser.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const signUp = async (req, res) => {
  try {
    const { name, password, phone } = req.body;
    console.log(req.body);

    const existingUser = await AppUser.findOne({ phoneNo: phone });
    if (existingUser) {
      throw new ApiError(400, "phone already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await AppUser.create({
      phoneNo: phone,
      name,
      password: hashedPassword,
    });

    return res.json(
      new ApiResponse(201, createdUser, "User created successfully")
    );
  } catch (error) {
    console.error("🔴 Error in signup:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};
