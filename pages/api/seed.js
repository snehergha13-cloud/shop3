import { connectDB } from "../../lib/db";
import { ok, error, forbidden } from "../../lib/response";
import { applyRateLimit } from "../../lib/rateLimit";
import Category from "../../models/Category";
import Collection from "../../models/Collection";
import Product from "../../models/Product";
import User from "../../models/User";

const DESK_OBJECTS_CATEGORY_SLUG = "desk_obj";
const DESK_OBJECTS_COLLECTION_SLUG = "dsk-obj";

// Add new categories here.
const categoryData = [
  {
    name: "Notebooks",
    slug: "notebooks",
    description: "Notebooks",
    imageUrl: "/assets/A5_softbound/C_1/A5 Notebooks - 1A.png",
  },
  {
    name: "Journals",
    slug: "journals",
    description: "Journals",
    imageUrl: "/assets/Journals/c1/LUNAR JOURNAL _ A.png",
  },
  {
    name: "Desk Objects",
    slug: DESK_OBJECTS_CATEGORY_SLUG,
    description: "Desk objects",
    imageUrl: "/assets/desk_obj/1.jpeg",
  },
];

// Add new collections here.
// Use categorySlug to connect the collection to a category.
const collectionData = [
  {
    name: "Deskline A5 Notebooks",
    slug: "c1-notebooks",
    description: "A collection of softbound notebooks in coordinated illustrated styles.",
    imageUrl: "/assets/A5_softbound/C_1/A5 Notebooks - 1A.png",
    categorySlug: "notebooks",
    sortOrder: 1,
  },
  {
    name: "Noir Et Blanc A5 Notebooks",
    slug: "c2-notebooks",
    description: "A collection of softbound notebooks in coordinated illustrated styles.",
    imageUrl: "/assets/A5_softbound/C_2/mock up.png",
    categorySlug: "notebooks",
    sortOrder: 2,
  },
  {
    name: "Desk Objects",
    slug: DESK_OBJECTS_COLLECTION_SLUG,
    description: "Personal leather desk objects.",
    imageUrl: "/assets/desk_obj/1.jpeg",
    categorySlug: DESK_OBJECTS_CATEGORY_SLUG,
    sortOrder: 3,
  },
];

// Add new products here.
// Use categorySlug and collectionSlug so you do not need database ids.
const productData = [
  {
    name: "Let It Change Notebook",
    slug: "p1-c1-notebook",
    description: "A softbound A5 notebook with illustrated cover artwork, smooth writing pages, and a compact everyday format.",
    price: 49900,
    comparePrice: 57000,
    sku: "NB-A5-C1-001",
    stock: 80,
    categorySlug: "notebooks",
    collectionSlug: "c1-notebooks",
    collectionOrder: 1,
    tags: ["notebook", "illustrated"],
    attributes: {
      pages: "192",
      format: "A5",
    },
    images: [
      "/assets/A5_softbound/C_1/Product - 1/Front.jpg",
      "/assets/A5_softbound/C_1/Product - 1/Back (1).jpg",
      "/assets/A5_softbound/C_1/Product - 1/Cover.jpg",
      "/assets/A5_softbound/C_1/Product - 1/Context 1.jpg",
      "/assets/A5_softbound/C_1/Product - 1/Inside.jpg",
      "/assets/A5_softbound/C_1/Product - 1/Open.jpg",
    ],
  },
  {
    name: "Chaos to Calm notebook",
    slug: "p2-c1-notebook",
    description: "A softbound A5 notebook with illustrated cover artwork, smooth writing pages, and a compact everyday format.",
    price: 49900,
    comparePrice: 57000,
    sku: "NB-A5-C1-002",
    stock: 80,
    categorySlug: "notebooks",
    collectionSlug: "c1-notebooks",
    collectionOrder: 2,
    tags: ["notebook", "illustrated"],
    attributes: {
      pages: "192",
      format: "A5",
    },
    images: [
      "/assets/A5_softbound/C_1/Product - 2/Front (1).jpg",
      "/assets/A5_softbound/C_1/Product - 2/Back.jpg",
      "/assets/A5_softbound/C_1/Product - 2/Cover.jpg",
      "/assets/A5_softbound/C_1/Product - 2/Context 1.jpg",
      "/assets/A5_softbound/C_1/Product - 2/Inside.jpg",
      "/assets/A5_softbound/C_1/Product - 2/Open.jpg",
    ],
  },
    {
        name: "World Domination Productivity Planner Notebook",
        slug: "p3-c1-notebook",
        description: "A softbound A5 notebook with illustrated cover artwork, smooth writing pages, and a compact everyday format.",
        price: 49900,
        comparePrice: 57000,
        sku: "NB-A5-C1-003",
        stock: 80,
        categorySlug: "notebooks",
        collectionSlug: "c1-notebooks",
        collectionOrder: 3,
        tags: ["notebook", "illustrated"],
        attributes: {
            pages: "192",
            format: "A5",
        },
        images: [
            "/assets/A5_softbound/C_1/Product - 3/Front.jpg",
            "/assets/A5_softbound/C_1/Product - 3/Back.jpg",
            "/assets/A5_softbound/C_1/Product - 3/Cover.jpg",
            "/assets/A5_softbound/C_1/Product - 3/Context 1.jpg",
            "/assets/A5_softbound/C_1/Product - 3/Inside.jpg",
            "/assets/A5_softbound/C_1/Product - 3/Open.jpg",
        ],
    },
    {
        name: "Lunar Notebook",
        slug: "p4-c1-notebook",
        description: "A softbound A5 notebook with illustrated cover artwork, smooth writing pages, and a compact everyday format.",
        price: 49900,
        comparePrice: 57000,
        sku: "NB-A5-C1-004",
        stock: 80,
        categorySlug: "notebooks",
        collectionSlug: "c1-notebooks",
        collectionOrder: 4,
        tags: ["notebook", "illustrated"],
        attributes: {
            pages: "192",
            format: "A5",
        },
        images: [
            "/assets/A5_softbound/C_1/Product - 4/Front (1).jpg",
            "/assets/A5_softbound/C_1/Product - 4/Back.jpg",
            "/assets/A5_softbound/C_1/Product - 4/Cover.jpg",
            "/assets/A5_softbound/C_1/Product - 4/Context 1.jpg",
            "/assets/A5_softbound/C_1/Product - 4/Inside.jpg",
            "/assets/A5_softbound/C_1/Product - 4/Open.jpg",
        ],
    },
    {
        name: "Old Fashioned Notebook",
        slug: "p1-c2-notebook",
        description: "A softbound A5 notebook with illustrated cover artwork, smooth writing pages, and a compact everyday format.",
        price: 59900,
        comparePrice: 69000,
        sku: "NB-A5-C2-001",
        stock: 80,
        categorySlug: "notebooks",
        collectionSlug: "c2-notebooks",
        collectionOrder: 1,
        tags: ["notebook", "illustrated"],
        attributes: {
            pages: "192",
            format: "A5",
        },
        images: [
            "/assets/A5_softbound/C_2/Product 1/Front (1).jpg",
            "/assets/A5_softbound/C_2/Product 1/Back.jpg",
            "/assets/A5_softbound/C_2/Product 1/Cover.jpg",
            "/assets/A5_softbound/C_2/Product 1/Context 1.jpg",
            "/assets/A5_softbound/C_2/Product 1/Inside.jpg",
            "/assets/A5_softbound/C_2/Product 1/Open.jpg",
        ],
    },
    {
        name: "Veni Vedi Vici Notebook",
        slug: "p2-c2-notebook",
        description: "A softbound A5 notebook with illustrated cover artwork, smooth writing pages, and a compact everyday format.",
        price: 59900,
        comparePrice: 69000,
        sku: "NB-A5-C2-002",
        stock: 80,
        categorySlug: "notebooks",
        collectionSlug: "c2-notebooks",
        collectionOrder: 2,
        tags: ["notebook", "illustrated"],
        attributes: {
            pages: "192",
            format: "A5",
        },
        images: [
            "/assets/A5_softbound/C_2/Product - 2/Front.jpg",
            "/assets/A5_softbound/C_2/Product - 2/Back.jpg",
            "/assets/A5_softbound/C_2/Product - 2/softcover-notebook-a5.jpg",
            "/assets/A5_softbound/C_2/Product - 2/Context 1.jpg",
            "/assets/A5_softbound/C_2/Product - 2/Copy of Inside.jpg",
            "/assets/A5_softbound/C_2/Product - 2/Open.jpg",
        ],
    },
    {
        name: "The Chosen One Notebook",
        slug: "p3-c2-notebook",
        description: "A softbound A5 notebook with illustrated cover artwork, smooth writing pages, and a compact everyday format.",
        price: 59900,
        comparePrice: 69000,
        sku: "NB-A5-C2-003",
        stock: 80,
        categorySlug: "notebooks",
        collectionSlug: "c2-notebooks",
        collectionOrder: 3,
        tags: ["notebook", "illustrated"],
        attributes: {
            pages: "192",
            format: "A5",
        },
        images: [
            "/assets/A5_softbound/C_2/Product - 3/Front.jpg",
            "/assets/A5_softbound/C_2/Product - 3/Back.jpg",
            "/assets/A5_softbound/C_2/Product - 3/Cover.jpg",
            "/assets/A5_softbound/C_2/Product - 3/Context 1.jpg",
            "/assets/A5_softbound/C_2/Product - 3/Inside.jpg",
            "/assets/A5_softbound/C_2/Product - 3/Open.jpg",
        ],
    },
    {
        name: "Million Dollar Dream Notebook",
        slug: "p4-c2-notebook",
        description: "A softbound A5 notebook with illustrated cover artwork, smooth writing pages, and a compact everyday format.",
        price: 59900,
        comparePrice: 69000,
        sku: "NB-A5-C2-004",
        stock: 80,
        categorySlug: "notebooks",
        collectionSlug: "c2-notebooks",
        collectionOrder: 4,
        tags: ["notebook", "illustrated"],
        attributes: {
            pages: "192",
            format: "A5",
        },
        images: [
            "/assets/A5_softbound/C_2/Product - 4/Front (1).jpg",
            "/assets/A5_softbound/C_2/Product - 4/Back.jpg",
            "/assets/A5_softbound/C_2/Product - 4/Cover.jpg",
            "/assets/A5_softbound/C_2/Product - 4/Context 1.jpg",
            "/assets/A5_softbound/C_2/Product - 4/Inside.jpg",
            "/assets/A5_softbound/C_2/Product - 4/Open.jpg",
        ],
    },
    {
        name: "Quiet Mind Notebook",
        slug: "p5-c2-notebook",
        description: "A softbound A5 notebook with illustrated cover artwork, smooth writing pages, and a compact everyday format.",
        price: 59900,
        comparePrice: 69000,
        sku: "NB-A5-C2-005",
        stock: 80,
        categorySlug: "notebooks",
        collectionSlug: "c2-notebooks",
        collectionOrder: 5,
        tags: ["notebook", "illustrated"],
        attributes: {
            pages: "192",
            format: "A5",
        },
        images: [
            "/assets/A5_softbound/C_2/Product - 5/Front.jpg",
            "/assets/A5_softbound/C_2/Product - 5/Back.jpg",
            "/assets/A5_softbound/C_2/Product - 5/Cover.jpg",
            "/assets/A5_softbound/C_2/Product - 5/Context 1.jpg",
            "/assets/A5_softbound/C_2/Product - 5/Inside.jpg",
            "/assets/A5_softbound/C_2/Product - 5/Open.jpg",
        ],
    },
    {
    name: "In My Universe Journal",
    slug: "Lunar-journal",
    description: "Lunar Journal\n" +
        "A premium hardbound notebook designed for thinkers, creators, and quiet moments of clarity\n" +
        "Minimal in form. Timeless in presence.\n" +
        "The Lunar Journal is a premium hardbound notebook crafted with luxurious 150 GSM paper and\n" +
        "a refined modern aesthetic - designed to hold your ideas beautifully.\n" +
        "Perfect for journaling, sketching, planning, note-taking, or gifting.\n" +
        "Details\n" +
        "● Premium Hardbound Finish\n" +
        "● Size: 21 × 14 cm\n" +
        "● Paper: 150 GSM thick premium sheets\n" +
        "● Smooth writing experience with minimal bleed-through\n" +
        "● Elegant minimalist design with luxury detailing\n" +
        "● Ideal for pens, pencils & light markers\n" +
        "Why You'll Love It\n" +
        "● Clean and sophisticated design language\n" +
        "● Premium tactile feel\n" +
        "● Designed for creatives, professionals & modern workspaces\n" +
        "● Minimal. Intentional. Timeless.",
    price: 129900,
    comparePrice: 197000,
    sku: "JN-001",
    stock: 80,
    categorySlug: "journals",
    collectionSlug: "c1-notebooks",
    collectionOrder: 1,
    tags: ["Journal", "illustrated"],
    attributes: {
      pages: "192",
      format: "A5",
    },
    images: [
      "/assets/Journals/c1/LUNAR JOURNAL _ A.png",
      "/assets/Journals/c1/LUNAR JOURNAL _ B.png",
      "/assets/Journals/c1/LUNAR JOURNAL _ C.png",
      "/assets/Journals/c1/LUNAR JOURNAL _ D.png",
      "/assets/Journals/c1/LUNAR JOURNAL _ E.png",
      "/assets/Journals/c1/LUNAR JOURNAL _ F.png"
    ],
  },
  {
    name: "Desk Objects - Trio Bundle",
    slug: "trio-bundle",
    description: "Specifications\n\nColour: Tan\n\nMaterial: Leatherite\n\nDimensions:\nDesk Mat: 45 (H) x 85 (W) cm\nTray: 16.5 (H) x 24 (W) cm\nMouse Pad: 23 (H) x 23 (W) cm\n\nPackage Contents:\n1 x Turf Leatherite Desk Mat\n1 x Valet Leatherite Tray\n1 x Orb Leatherite Mouse Pad\n\nCare:\nLeatherite can be wiped clean using a non-abrasive dampened cloth. Thorough air drying is crucial to keep it bacteria free.\n\nCountry of Origin:\nDesigned and Made In India",
    price: 199900,
    comparePrice: 299900,
    sku: "DO-001",
    stock: 80,
    categorySlug: DESK_OBJECTS_CATEGORY_SLUG,
    collectionSlug: DESK_OBJECTS_COLLECTION_SLUG,
    collectionOrder: 1,
    tags: ["Desk Object", "illustrated"],
    attributes: {
      product_color: "tan",
      product_type: "deskmat",
    },
    images: [
      "/assets/desk_obj/1.jpeg",
      "/assets/desk_obj/2.jpeg",
      "/assets/desk_obj/3.jpeg",
      "/assets/desk_obj/4.jpeg",
      "/assets/desk_obj/5.jpeg",
    ],
  },
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!applyRateLimit(req, res, { scope: "seed", limit: 3, windowMs: 15 * 60_000 })) return;

  const seedSecret = process.env.SEED_SECRET;
  const providedSecret = req.headers["x-seed-secret"];

  if (!seedSecret || providedSecret !== seedSecret) {
    return forbidden(res, "Seed access denied. Set SEED_SECRET and pass it as the x-seed-secret header.");
  }

  if (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
    return error(res, "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be configured before seeding.", 500);
  }

  try {
    await connectDB();

    await Product.deleteMany({});
    await Collection.deleteMany({});
    await Category.deleteMany({});

    const categories = {};
    for (const category of categoryData) {
      const doc = await Category.create(category);
      categories[category.slug] = doc;
    }

    const collections = {};
    for (const collection of collectionData) {
      const category = categories[collection.categorySlug];
      const doc = await Collection.create({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        imageUrl: collection.imageUrl,
        category: category._id,
        sortOrder: collection.sortOrder ?? 0,
        isActive: collection.isActive ?? true,
      });
      collections[collection.slug] = doc;
    }

    const products = productData.map((product) => ({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      sku: product.sku,
      stock: product.stock,
      category: categories[product.categorySlug]._id,
      collection: collections[product.collectionSlug]._id,
      collectionOrder: product.collectionOrder ?? 0,
      tags: product.tags ?? [],
      brand: product.brand,
      isFeatured: product.isFeatured ?? false,
      isActive: product.isActive ?? true,
      attributes: product.attributes ?? {},
      images: product.images ?? [],
    }));

    await Product.insertMany(products);

    // Seed a default admin account, but only if one doesn't already exist —
    // re-running /api/seed should never reset an admin's password.
    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;
    let adminMessage = "";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: "Store Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      adminMessage = ` Admin account created: ${adminEmail}. Change this password after first login.`;
    } else {
      adminMessage = ` Admin account already exists (${adminEmail}).`;
    }

    return ok(res, {
      message: `Seeded ${categoryData.length} categories, ${collectionData.length} collections and ${products.length} products.${adminMessage}`,
    });
  } catch (err) {
    console.error("[seed]", err);

    // This endpoint is a one-time setup tool, not public-facing storefront
    // API — surfacing the real error (bad MONGODB_URI, duplicate key, a
    // validation failure, etc.) is far more useful here than a generic
    // "Internal server error" that hides what actually went wrong.
    let detail = err.message;

    if (err.name === "ValidationError") {
      // Mongoose validation errors: pull out the specific field problems.
      detail = Object.values(err.errors).map((e) => e.message).join("; ");
    } else if (err.code === 11000) {
      // Duplicate key error (e.g. a SKU or slug that already exists).
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      detail = `Duplicate value for "${field}" — a record with this value already exists.`;
    }

    return error(res, `Seed failed: ${detail}`, 500);
  }
}