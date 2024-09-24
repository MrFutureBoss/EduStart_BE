import { Timestamp } from "bson";
import mongoose from "mongoose";

const SpecialtySchema = new Schema(
    {
        name: {
            type: String,
            minlength: 2,
            maxlength: 50,
            unique: true,
            require: true,
        },
    },
    {
        timestamps: true,
    }
)

const Special = mongoose.model(
    "Specialty", SpecialtySchema
);
export default Special;