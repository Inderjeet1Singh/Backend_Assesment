import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
});

const workSchema = new mongoose.Schema({
  role: String,
  experience: String,
  type: String,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    education: String,

    skills: [String],

    projects: [projectSchema],

    work: [workSchema],

    links: {
      github: String,
      linkedin: String,
      portfolio: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
