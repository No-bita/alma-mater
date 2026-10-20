import { createHmac } from "node:crypto";
import { z } from "zod";

/**
 * Waitlist validation and rate limiting (spec section 6, groundwork for phase 4).
 *
 * Server-only module. The join-waitlist Server Action (phase 4) will:
 *   1. Parse the form payload with `joinWaitlistSchema` (rejects honeypot spam).
 *   2. Hash the caller IP with `hashIp` (HMAC-SHA256, secret from env).
 *   3. Enforce the per-IP limit with `isRateLimited` against `waitlist_attempts`.
 *   4. Insert into `waitlist` and map unique-violation (SQLSTATE 23505) to
 *      "You're already on the list".
 *
 * Rate limiting follows option (a): a database check on a hashed IP, no extra
 * dependency. Only the hash ever touches the database, never a raw IP.
 *
 * This table is independent of any login allowlist: the waitlist stores intent
 * to hear about launch, nothing here grants or denies access to any product.
 */

export const WAITLIST_ROLES = ["student", "recent_grad", "alum"] as const;

const optionalShortText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const joinWaitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .pipe(z.email()),
  role: z.enum(WAITLIST_ROLES),
  college: z.string().trim().min(1).max(120),
  firstNeed: optionalShortText(280),
  source: optionalShortText(120),
  // Honeypot: real users never see or fill this field. Bots that do are spam.
  company: z.string().max(0).optional(),
});

export type JoinWaitlistInput = z.input<typeof joinWaitlistSchema>;
export type JoinWaitlistData = z.output<typeof joinWaitlistSchema>;

/** Per-IP rate limit for waitlist submissions. */
export const RATE_LIMIT_MAX_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Hash a caller IP so the database never stores a raw address. The secret
 * comes from the IP_HASH_SECRET environment variable (see .env.example).
 */
export function hashIp(ip: string, secret: string): string {
  return createHmac("sha256", secret).update(ip).digest("hex");
}

/**
 * Pure rate-limit decision over the timestamps of recent attempts by one
 * hashed IP. Phase 4 fetches those rows from `waitlist_attempts` and records
 * a new attempt row for every submission, allowed or not.
 */
export function isRateLimited(
  attemptedAts: readonly Date[],
  now: Date = new Date(),
  maxAttempts: number = RATE_LIMIT_MAX_ATTEMPTS,
  windowMs: number = RATE_LIMIT_WINDOW_MS,
): boolean {
  const windowStart = now.getTime() - windowMs;
  const recent = attemptedAts.filter((t) => t.getTime() >= windowStart);
  return recent.length >= maxAttempts;
}
