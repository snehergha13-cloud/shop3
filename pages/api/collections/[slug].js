import { connectDB } from "../../../lib/db";
import { ok, notFound, serverError } from "../../../lib/response";
import Collection from "../../../models/Collection";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    await connectDB();

    if (req.method === "GET") {
      const collection = await Collection.findOne({ slug, isActive: true })
        .populate("category", "name slug")
        .lean();

      if (!collection) return notFound(res, "Collection not found");

      const products = await Product.find({
        collection: collection._id,
        isActive: true,
      })
        .populate("category", "name slug")
        .populate("collection", "name slug")
        .sort({ collectionOrder: 1, createdAt: 1 })
        .lean();

      return ok(res, { collection, products });
    }

    return res.status(405).end();
  } catch (err) {
    console.error("[collection slug]", err);
    return serverError(res);
  }
}
