// controllers/settingController.js

import { Setting } from "../model/setting.model.js";
import { User } from "../model/User.model.js";

export const saveUserSettings = async (req, res) => {
  try {
    const {
      watermarkType,
      watermarkText,
      fontStyle,
      fontColor,
      fontSize,
      opacity,
      position,
      iconImg,
      userId,
      waterMarkEnabled
    } = req.body;

    const update = {
      watermarkType,
      watermarkText,
      fontStyle,
      fontColor,
      fontSize,
      opacity,
      position,
      iconImg,
      waterMarkEnabled
    };

    const setting = await Setting.findOneAndUpdate(
      { user: userId },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: "Settings saved successfully",
      data: setting,
    });
  } catch (error) {
    console.error("Error saving user settings:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUserSettings = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user=User.findById({userId})


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
        const settings = await Setting.findOne({ user: userId });


    return res.status(200).json({ data: settings });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

