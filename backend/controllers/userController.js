import userModel from "../models/userModel.js";

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await userModel
      .findByIdAndUpdate(req.userId, req.body, { new: true })
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchBySkill = async (req, res) => {
  try {
    const q = req.query.q;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.json({
        success: true,
        data: [],
        pagination: { page, limit, totalPages: 0 },
      });
    }

    const skills = q
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const skillRegex = skills.map((s) => new RegExp(`^${s}$`, "i"));

    const users = await userModel
      .find({
        skills: { $all: skillRegex },
      })
      .select("-password")
      .skip(skip)
      .limit(limit);

    const total = await userModel.countDocuments({
      skills: { $all: skillRegex },
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
