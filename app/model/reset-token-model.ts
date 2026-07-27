import mongoose, { Schema } from "mongoose";


const ResetTokenSchema = new Schema({
    email: {type: String, required:true},
    token:{type: String, required:true, unique:true},
    expires: {type: Date, required: true},
})

export default mongoose.models.ResetToken || mongoose.model("ResetToken", ResetTokenSchema)