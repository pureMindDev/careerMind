import { BrevoClient } from "@getbrevo/brevo";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

function isBrevoConfigured() {
  return Boolean(env.brevo.apiKey);
}

let client = null;
function getClient() {
  if (!client) client = new BrevoClient({ apiKey: env.brevo.apiKey });
  return client;
}

/**
 * Sends an email via Brevo if BREVO_API_KEY is configured; otherwise logs it
 * so local/dev environments stay fully usable without a real provider.
 */
async function sendMail({ to, subject, html, text }) {
  if (!isBrevoConfigured()) {
    logger.info(`[email:fallback] To: ${to} | Subject: ${subject}\n${text || html}`);
    return { delivered: false };
  }

  try {
    await getClient().transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      textContent: text,
      sender: { name: env.brevo.senderName, email: env.brevo.senderEmail },
      to: [{ email: to }],
    });
    return { delivered: true };
  } catch (err) {
    // Never let a flaky email provider break the request (signup/reset should
    // still succeed); log loudly instead so it's visible in monitoring.
    logger.error("Brevo send failed:", err.message);
    return { delivered: false };
  }
}

export async function sendPasswordResetEmail({ to, token }) {
  const resetUrl = `${env.clientOrigin[0]}/reset-password?token=${encodeURIComponent(token)}`;
  return sendMail({
    to,
    subject: "Reset your CareerMind AI password",
    text: `Reset your password: ${resetUrl} (this link expires in 30 minutes)`,
    html: `<p>Someone requested a password reset for this email.</p>
<p><a href="${resetUrl}">Reset your password</a> (expires in 30 minutes)</p>
<p>If this wasn't you, you can safely ignore this email.</p>`,
  });
}

export async function sendVerificationEmail({ to, token }) {
  const verifyUrl = `${env.clientOrigin[0]}/verify-email?token=${encodeURIComponent(token)}`;
  return sendMail({
    to,
    subject: "Verify your CareerMind AI email",
    text: `Verify your email: ${verifyUrl} (this link expires in 24 hours)`,
    html: `<p>Welcome to CareerMind AI! Confirm this is your email address to finish setting up your account.</p>
<p><a href="${verifyUrl}">Verify your email</a> (expires in 24 hours)</p>
<p>If you didn't create this account, you can safely ignore this email.</p>`,
  });
}
