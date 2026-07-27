import mongoose, { Schema } from "mongoose";


const VerifySchema = new Schema({
    email: {type: String, required:true},
    token: {type: String, required:true, unique: true},
    expires: {type: Date, required: true}
})

export default mongoose.models.VerifyToken || mongoose.model("VerifyToken", VerifySchema)