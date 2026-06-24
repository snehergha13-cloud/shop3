import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    collectionOrder: { type: Number, default: 0 },
    brand: { type: String, trim: true },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    tags: [{ type: String, lowercase: true }],
    attributes: { type: Map, of: String, default: {} },
    reviews: [ReviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    // "collection" is technically a reserved Mongoose document property,
    // but this schema only ever uses it as a plain ObjectId ref field via
    // .create()/.populate() — never as a setter that would collide with
    // Mongoose's internal collection accessor — so it's safe here.
    suppressReservedKeysWarning: true,
  }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
