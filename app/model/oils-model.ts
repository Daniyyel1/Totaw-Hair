import mongoose, { Schema } from "mongoose";

const ReviewSchema = new mongoose.Schema({
    reviewer:{type: String},
    comment:{type: String},
    rating:{type:Number},
    cratedAt:{type:Date, default:Date.now}
})

const BenefitSchema = new mongoose.Schema({
    label:{type: String},
    benefit:{type: String}
})

const UseSchema = new mongoose.Schema({
    label:{type: String},
    usage:{type: String}
})


const OilSchema = new Schema({
    name:{type: String, required:true},
    price:{type: Number, required:true},
    itemImage:{type: String, required: true},
    reviews:{type: [ReviewSchema], default: []},
    description:{type: String},
    benefits:[BenefitSchema],
    use:[UseSchema]

})

export default mongoose.models.Oil || mongoose.model("Oil", OilSchema);