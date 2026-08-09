import crypto from "crypto";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../services/email.service.js";
import { ok, created } from "../utils/response.js";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function issueVerificationToken(user) {
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationTokenHash = crypto.createHash("sha256").update(token).digest("hex");
  user.verificationTokenExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  return token;
}

export async function signup(req, res) {
  const data = req.body;
  const existing = await User.findOne({ email: data.email });
  if (existing) return res.status(409).json({ message: "An account with that email already exists" });

  const user = await User.create(data);
  const token = issueVerificationToken(user);
  await user.save();
  await sendVerificationEmail({ to: user.email, token });

  created(res, { token: generateToken(user.id), user: user.toProfile() });
}

export async function login(req, res) {
  const data = req.body;
  const user = await User.findOne({ email: data.email }).select("+password");
  if (!user || !(await user.comparePassword(data.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  ok(res, { token: generateToken(user.id), user: user.toProfile() });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();
    await sendPasswordResetEmail({ to: user.email, token });
  }

  // Always the same response so accounts cannot be enumerated.
  ok(res, { ok: true });
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetTokenHash: hash,
    resetTokenExpiresAt: { $gt: new Date() },
  }).select("+password +resetTokenHash +resetTokenExpiresAt");

  if (!user) return res.status(400).json({ message: "Reset link is invalid or has expired" });

  user.password = password;
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();
  ok(res, { ok: true });
}

export async function verifyEmail(req, res) {
  const { token } = req.body;
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    verificationTokenHash: hash,
    verificationTokenExpiresAt: { $gt: new Date() },
  }).select("+verificationTokenHash +verificationTokenExpiresAt");

  if (!user) return res.status(400).json({ message: "Verification link is invalid or has expired" });

  user.emailVerified = true;
  user.verificationTokenHash = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();
  ok(res, { ok: true, user: user.toProfile() });
}

export async function resendVerification(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Same response either way so accounts can't be enumerated.
  if (user && !user.emailVerified) {
    const token = issueVerificationToken(user);
    await user.save();
    await sendVerificationEmail({ to: user.email, token });
  }

  ok(res, { ok: true });
}

export function me(req, res) {
  ok(res, req.user.toProfile());
}
