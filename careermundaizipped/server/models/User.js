import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const settingsSchema = new mongoose.Schema(
  {
    theme: { type: String, default: "dark" },
    notifyMatches: { type: Boolean, default: true },
    notifyCv: { type: Boolean, default: true },
    notifyRoadmap: { type: Boolean, default: true },
    notifyDigest: { type: Boolean, default: false },
    notifyProduct: { type: Boolean, default: false },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    plan: { type: String, enum: ["Starter", "Pro", "Campus"], default: "Starter" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    targetRole: { type: String, default: "" },
    bio: { type: String, default: "" },
    settings: { type: settingsSchema, default: () => ({}) },
    emailVerified: { type: Boolean, default: false },
    verificationTokenHash: { type: String, select: false },
    verificationTokenExpiresAt: { type: Date, select: false },
    resetTokenHash: { type: String, select: false },
    resetTokenExpiresAt: { type: Date, select: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toProfile = function toProfile() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    plan: this.plan,
    role: this.role,
    targetRole: this.targetRole,
    bio: this.bio,
    theme: this.settings?.theme ?? "dark",
    settings: this.settings,
    emailVerified: this.emailVerified,
  };
};

export const User = mongoose.model("User", userSchema);
