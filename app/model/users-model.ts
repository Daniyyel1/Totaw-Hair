import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  profilePicture: {type: String},
  bio: {type: String},
  telephone : {type: String},
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  emailVerified: { type: Date, default: null },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
