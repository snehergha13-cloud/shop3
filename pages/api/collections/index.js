import { connectDB } from "../../../lib/db";
import { getAuthUser } from "../../../lib/auth";
import { ok, created, error, forbidden, serverError } from "../../../lib/response";
import Category from "../../../models/Category";
import Collection from "../../../models/Collection";

const slugify = (value) =>
    value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === "GET") {
      const { category } = req.query;

      // DEBUG LOG (added here)
      console.log("CATEGORY QUERY:", category);

      const filter = { isActive: true };

      if (category) {
        const categoryDoc = await Category.findOne({ slug: category });

        if (!categoryDoc) return ok(res, []);

        filter.category = categoryDoc._id;
      }

      const collections = await Collection.find(filter)
          .populate("category", "name slug")
          .sort({ sortOrder: 1, name: 1 })
          .lean();

      return ok(res, collections);
    }

    if (req.method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") return forbidden(res);

      const { name, description, imageUrl, category, sortOrder } = req.body;

      if (!name || !category) {
        return error(res, "name and category are required");
      }

      const collection = await Collection.create({
        name,
        slug: slugify(name),
        description,
        imageUrl,
        category,
        sortOrder: sortOrder ?? 0,
      });

      return created(res, await collection.populate("category", "name slug"));
    }

    return res.status(405).end();
  } catch (err) {
    if (err.code === 11000) {
      return error(res, "Collection already exists", 409);
    }

    console.error("[collections]", err);
    return serverError(res);
  }
}