import { Timestamp } from "bson";
import mongoose from "mongoose";

const SpecialtySchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        favorite: {
            type: Boolean,
        }
    },
    {
        timestamps: true,
    }
)

const Special = mongoose.model(
    "Specialty", SpecialtySchema
);
export default Special;