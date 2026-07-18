import { connectDB } from "../../../lib/db";
import { ok, notFound, serverError } from "../../../lib/response";
import Category from "../../../models/Category";
import Collection from "../../../models/Collection";
import Product from "../../../models/Product";

const DESK_OBJECT_COLLECTION_SLUGS = ["dsk-obj", "desk-objects", "desk_obj"];
const DESK_OBJECT_CATEGORY_SLUGS = ["desk_obj", "desk-objects", "dsk-obj"];

const getCollectionSlugCandidates = (slug) => {
  const normalizedSlug = String(slug || "").trim().toLowerCase();

  if (DESK_OBJECT_COLLECTION_SLUGS.includes(normalizedSlug)) {
    return DESK_OBJECT_COLLECTION_SLUGS;
  }

  return [normalizedSlug];
};

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    await connectDB();

    if (req.method === "GET") {
      const slugCandidates = getCollectionSlugCandidates(slug);

      // `$ne: false` keeps explicitly disabled records hidden while still
      // supporting older seeded records that do not contain isActive yet.
      const collection = await Collection.findOne({
        slug: { $in: slugCandidates },
        isActive: { $ne: false },
      })
        .populate("category", "name slug")
        .lean();

      if (!collection) return notFound(res, "Collection not found");

      const activeProductFilter = { isActive: { $ne: false } };

      let products = await Product.find({
        ...activeProductFilter,
        collection: collection._id,
      })
        .populate("category", "name slug")
        .populate("collection", "name slug")
        .sort({ collectionOrder: 1, name: 1, createdAt: 1 })
        .lean();

      /*
       * Some existing databases were seeded while the Desk Objects category
       * and collection used different legacy slugs. If the collection card is
       * valid but its old product reference points at an earlier collection
       * ObjectId, recover the Desk Objects products by category. This fallback
       * is intentionally restricted to Desk Objects so unrelated collections
       * cannot accidentally absorb products from another collection.
       */
      const isDeskObjectsCollection =
        slugCandidates.some((value) => DESK_OBJECT_COLLECTION_SLUGS.includes(value)) ||
        String(collection.name || "").trim().toLowerCase() === "desk objects";

      if (products.length === 0 && isDeskObjectsCollection) {
        const deskObjectCategories = await Category.find({
          slug: { $in: DESK_OBJECT_CATEGORY_SLUGS },
        })
          .select("_id")
          .lean();

        if (deskObjectCategories.length > 0) {
          products = await Product.find({
            ...activeProductFilter,
            category: { $in: deskObjectCategories.map((category) => category._id) },
          })
            .populate("category", "name slug")
            .populate("collection", "name slug")
            .sort({ collectionOrder: 1, name: 1, createdAt: 1 })
            .lean();
        }
      }

      return ok(res, { collection, products });
    }

    return res.status(405).end();
  } catch (err) {
    console.error("[collection slug]", err);
    return serverError(res);
  }
}
