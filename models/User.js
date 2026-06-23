import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: "India" },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Password is not required for accounts created via Google Sign-In.
    password: { type: String, minlength: 8, select: false },
    googleId: { type: String, unique: true, sparse: true, select: false },
    picture: { type: String },
    authProvider: { type: String, enum: ["password", "google"], default: "password" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
