import { test } from "node:test";
import assert from "node:assert/strict";
import {
  joinWaitlistSchema,
  hashIp,
  isRateLimited,
  RATE_LIMIT_MAX_ATTEMPTS,
} from "./validation.ts";

const valid = {
  email: "Aaryan@Example.com",
  role: "student",
  college: "IIT (BHU)",
};

test("accepts a valid payload and normalizes email", () => {
  const data = joinWaitlistSchema.parse(valid);
  assert.equal(data.email, "aaryan@example.com");
  assert.equal(data.role, "student");
  assert.equal(data.college, "IIT (BHU)");
  assert.equal(data.firstNeed, undefined);
  assert.equal(data.source, undefined);
});

test("keeps optional fields when provided", () => {
  const data = joinWaitlistSchema.parse({
    ...valid,
    firstNeed: "Get a referral at a company I'm targeting.",
    source: "utm_launch",
  });
  assert.equal(data.firstNeed, "Get a referral at a company I'm targeting.");
  assert.equal(data.source, "utm_launch");
});

test("rejects an invalid email", () => {
  assert.throws(() => joinWaitlistSchema.parse({ ...valid, email: "not-an-email" }));
});

test("rejects an unknown role", () => {
  assert.throws(() => joinWaitlistSchema.parse({ ...valid, role: "professor" }));
});

test("rejects a missing or empty college", () => {
  assert.throws(() => joinWaitlistSchema.parse({ email: valid.email, role: valid.role }));
  assert.throws(() => joinWaitlistSchema.parse({ ...valid, college: "   " }));
});

test("rejects an over-long first need", () => {
  assert.throws(() =>
    joinWaitlistSchema.parse({ ...valid, firstNeed: "x".repeat(281) }),
  );
});

test("empty optional text normalizes to undefined", () => {
  const data = joinWaitlistSchema.parse({ ...valid, firstNeed: "   ", source: "" });
  assert.equal(data.firstNeed, undefined);
  assert.equal(data.source, undefined);
});

test("honeypot field must be empty", () => {
  assert.equal(joinWaitlistSchema.parse({ ...valid, company: "" }).company, "");
  assert.throws(() => joinWaitlistSchema.parse({ ...valid, company: "spammy" }));
});

test("hashIp is deterministic and salted", () => {
  const a = hashIp("203.0.113.7", "secret-one");
  assert.equal(a, hashIp("203.0.113.7", "secret-one"));
  assert.notEqual(a, hashIp("203.0.113.7", "secret-two"));
  assert.notEqual(a, hashIp("203.0.113.8", "secret-one"));
  assert.match(a, /^[0-9a-f]{64}$/);
  assert.ok(!a.includes("203.0.113.7"));
});

test("isRateLimited blocks at the limit and ignores old attempts", () => {
  const now = new Date("2026-10-20T12:00:00Z");
  const within = (minsAgo: number) => new Date(now.getTime() - minsAgo * 60_000);

  const underLimit = Array.from({ length: RATE_LIMIT_MAX_ATTEMPTS - 1 }, (_, i) => within(i + 1));
  assert.equal(isRateLimited(underLimit, now), false);

  const atLimit = [...underLimit, within(10)];
  assert.equal(isRateLimited(atLimit, now), true);

  const outsideWindow = Array.from({ length: RATE_LIMIT_MAX_ATTEMPTS }, () => within(120));
  assert.equal(isRateLimited(outsideWindow, now), false);
});
