import { connectDB } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { ok, created, error, forbidden, serverError } from "../../../lib/response";
import Product from "../../../models/Product";
import Category from "../../../models/Category";
import Collection from "../../../models/Collection";

export default async function handler(req, res) {
  try {
    await connectDB();
    if (req.method === "GET") {
      const { category, collection, search, minPrice, maxPrice, sort = "-createdAt", page = 1, limit = 20, featured } = req.query;
      const filter = { isActive: true };
      if (category) { const cat = await Category.findOne({ slug: category }); if (cat) filter.category = cat._id; }
      if (collection) {
        const collectionDoc = await Collection.findOne({ slug: collection, isActive: true });
        if (collectionDoc) filter.collection = collectionDoc._id;
        else filter.collection = null;
      }
      if (search) filter.$text = { $search: search };
      if (minPrice || maxPrice) filter.price = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
      if (featured === "true") filter.isFeatured = true;
      const sortBy = sort === "collectionOrder" ? { collectionOrder: 1, createdAt: 1 } : sort;
      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .populate("category", "name slug")
        .populate("collection", "name slug")
        .sort(sortBy)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean();
      return ok(res, { products, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } });
    }
    if (req.method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") return forbidden(res);
      const { name, description, price, category, collection, sku, stock, images, tags, attributes, comparePrice, brand } = req.body;
      if (!name || !description || !price || !category || !collection || !sku) return error(res, "name, description, price, category, collection and sku are required");
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const product = await Product.create({ name, slug, description, price, comparePrice, category, collection, sku, stock: stock ?? 0, images: images ?? [], tags: tags ?? [], attributes: attributes ?? {}, brand });
      return created(res, await product.populate([{ path: "category", select: "name slug" }, { path: "collection", select: "name slug" }]));
    }
    return res.status(405).end();
  } catch (err) {
    if (err.code === 11000) return error(res, "SKU already exists", 409);
    console.error("[products]", err);
    return serverError(res);
  }
}
