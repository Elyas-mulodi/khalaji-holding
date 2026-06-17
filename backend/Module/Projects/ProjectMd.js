import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "نام پروژه الزامی است"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "دسته‌بندی الزامی است"],
    },
    description: {
      type: String,
      required: [true, "توضیحات الزامی است"],
    },
    location: {
      type: String,
      default: null,
    },
    yearBuilt: {
      type: Number,
      default: null,
    },
    image: {
      type: [String],
      default: [],
    },
    catalogFile: {
      type: String,
      default: null,
    },
    catalogTitle: {
      type: String,
      default: null,
    },
    catalogDescription: {
      type: String,
      default: null,
    },
    inOnging: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    features: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: Number,
      default: 0,
    },
    relatedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;