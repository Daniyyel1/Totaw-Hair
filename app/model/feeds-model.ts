import mongoose, { Schema } from "mongoose";

const FeedSchema = new Schema({

    email:{type: String}

})

export default mongoose.models.Feed || mongoose.model("Feed", FeedSchema);