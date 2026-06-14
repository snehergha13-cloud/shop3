import { connectDB } from "../../lib/db";
import { getAuthUser } from "../../lib/auth";
import { ok, created, error, forbidden, serverError } from "../../lib/response";
import Category from "../../models/Category";

export default async function handler(req, res) {
  try {
    await connectDB();
    if (req.method === "GET") {
      const categories = await Category.find().sort({ name: 1 });
      return ok(res, categories);
    }
    if (req.method === "POST") {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== "admin") return forbidden(res);
      const { name, description, imageUrl } = req.body;
      if (!name) return error(res, "Name is required");
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const category = await Category.create({ name, slug, description, imageUrl });
      return created(res, category);
    }
    return res.status(405).end();
  } catch (err) {
    if (err.code === 11000) return error(res, "Category already exists", 409);
    console.error("[categories]", err);
    return serverError(res);
  }
}
