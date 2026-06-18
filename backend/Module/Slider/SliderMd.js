import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان اسلایدر الزامی است"],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      required: [true, "تصویر اسلایدر الزامی است"],
    },
    section: {
      type: String,
      required: [true, "بخش اسلایدر الزامی است"],
      enum: ["home", "about", "projects"],
      default: "home",
    }, 
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;