import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Hero } from "../components/Hero.tsx";
import { Nav } from "../components/Nav.tsx";
import { copy } from "../content/copy.ts";
import { heroPairs } from "../content/heroPairs.ts";

const html = renderToStaticMarkup(<Hero />);

test("hero first render opens on the question: searching card, no answer, no strike-through", () => {
  assert.match(html, /QUESTION 1 OF 6 · REFERRAL/);
  assert.match(html, /ALUMNI ADMIT CARD · MATCH FOR: REFERRAL/);
  assert.match(html, /Matching your question to an alum…/);
  assert.match(html, /data-searching/);
  assert.ok(!html.includes("Ananya Rao"));
  assert.ok(!html.includes(heroPairs[0]!.subhead));
  assert.match(html, /decoration-transparent/);
  assert.ok(!html.includes("decoration-stamp-red"));
  assert.match(html, /Illustrative example/);
});

test("hero has a headline, both CTAs and the two-line stamp", () => {
  assert.match(html, /<h1[^>]*>No one to refer you at your dream company\?<\/h1>/);
  assert.match(html, /JOIN THE WAITLIST/);
  assert.match(html, /I’m an alum\. I want to help\./);
  assert.match(html, /LIFE IS UNFAIR\.<br\/>USE YOUR UNFAIR ADVANTAGE\./);
});

test("six pills, real buttons, 44px minimum, in order", () => {
  const pills = html.match(/<button[^>]*aria-pressed[^>]*>[^<]*<\/button>/g) ?? [];
  assert.equal(pills.length, 6);
  for (const [i, p] of pills.entries()) {
    assert.match(p, /min-h-11/);
    assert.ok(p.includes(heroPairs[i]!.pill));
  }
  assert.match(pills[0]!, /aria-pressed="true"/);
  assert.match(pills[1]!, /aria-pressed="false"/);
});

test("live region announces only the solution", () => {
  // First render is the question phase, so the region is empty: nothing is announced yet.
  const live = html.match(/<p aria-live="polite"[^>]*>([^<]*)<\/p>/);
  assert.ok(live);
  assert.equal(live![1], "");
  assert.equal((html.match(/aria-live/g) ?? []).length, 1);
});

test("headline reserves three lines", () => {
  assert.match(html, /sm:min-h-\[calc\(3\*1\.02em\)\]/);
});

test("handwriting stays at or above 24px in the hero", () => {
  assert.match(html, /text-\[34px\]/);
  assert.ok(!/text-(xs|sm|base|lg|xl)\b[^"]*font-hand|font-hand[^"]*text-(xs|sm|base|lg|xl)\b/.test(html));
});

test("hero copy comes from content files, nav matches spec", () => {
  const nav = renderToStaticMarkup(<Nav />);
  assert.ok(nav.includes(copy.nav.wordmark));
  assert.ok(nav.includes(copy.nav.badge));
  assert.ok(nav.includes(copy.nav.joinButton));
  assert.match(nav, /href="#waitlist"/);
  assert.match(nav, /href="#for-alumni"/);
  assert.match(nav, /border-b-2 border-ink/);
});

test("grid columns can shrink, so the pill row scrolls inside itself instead of widening the page", () => {
  assert.match(html, /grid-cols-\[minmax\(0,1fr\)\]/);
  assert.ok((html.match(/min-w-0/g) ?? []).length >= 2);
  assert.match(html, /overflow-x-auto/);
});
