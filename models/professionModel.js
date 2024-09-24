import mongoose from "mongoose";
const professionSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      unique: true,
      require: true,
    },

    specialty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specialty",
        require: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Profession = mongoose.model("Profession", professionSchema);
export default Special;
