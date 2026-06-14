import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    imageUrl: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CollectionSchema.index({ category: 1, sortOrder: 1 });

export default mongoose.models.Collection ||
  mongoose.model("Collection", CollectionSchema);
