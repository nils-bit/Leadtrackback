/**
 * POST /api/onboard/detect
 *
 * Auto-detects branding for a customer's website during onboarding.
 * Given a `{ url }` payload, fetches the page and extracts:
 *   - company   (og:site_name → cleaned <title>)
 *   - color     (theme-color meta → dominant hex in <style>/first <link rel=stylesheet>)
 *   - logo      (og:image → <link rel=icon>)
 *   - favicon   (<link rel=icon> → /favicon.ico)
 *   - description (og:description → <meta name=description>)
 *
 * Designed for the onboarding wizard so the widget pre-fills sensible defaults.
 * Pure regex parsing — no external dependencies, Edge-friendly.
 */

import { optionsResponse, jsonResponse } from "../../widget/cors";

const FALLBACK_COLOR = "#FF6B35";
const USER_AGENT = "Mozilla/5.0 (LeadTrackBack)";
const FETCH_TIMEOUT_MS = 10000;
const STYLESHEET_TIMEOUT_MS = 3000;

interface DetectResult {
  company: string;
  color: string;
  logo: string | null;
  favicon: string;
  description: string | null;
  url: string;
}

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}

export async function POST(request: Request) {
  let rawUrl: string | undefined;
  try {
    const body = await request.json();
    rawUrl = body?.url;
  } catch {
    return jsonResponse({ error: "invalid JSON body" }, request, 400);
  }

  if (!rawUrl || typeof rawUrl !== "string") {
    return jsonResponse({ error: "url required" }, request, 400);
  }

  // Normalize: add https:// if missing a protocol
  let normalized = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = "https://" + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return jsonResponse({ error: "invalid URL" }, request, 400);
  }

  // Reject garbage: localhost, IP addresses, non-http(s)
  if (!/^https?:$/.test(parsed.protocol)) {
    return jsonResponse({ error: "only http(s) URLs are allowed" }, request, 400);
  }
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ||
    host.includes(":") // IPv6
  ) {
    return jsonResponse({ error: "localhost and IP addresses are not allowed" }, request, 400);
  }

  try {
    const html = await fetchText(parsed.toString(), FETCH_TIMEOUT_MS);
    const result = await extractBranding(html, parsed);
    return jsonResponse(result, request);
  } catch {
    return jsonResponse(buildFallback(parsed), request);
  }
}

async function fetchText(url: string, timeoutMs: number): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(timeoutMs),
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`fetch failed: ${res.status}`);
  }
  return await res.text();
}

async function extractBranding(html: string, base: URL): Promise<DetectResult> {
  const company = extractCompany(html, base);
  const logo = extractLogo(html, base);
  const favicon = extractFavicon(html, base);
  const description = extractDescription(html);
  const color = await extractColor(html, base);

  return {
    company,
    color,
    logo,
    favicon,
    description,
    url: base.toString(),
  };
}

function extractCompany(html: string, base: URL): string {
  const ogSite = matchMetaProperty(html, "og:site_name");
  if (ogSite) return cleanTitle(ogSite);

  const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (titleMatch) {
    const cleaned = cleanTitle(decodeEntities(titleMatch[1]));
    if (cleaned) return cleaned;
  }

  // Fallback: capitalize the registrable part of the hostname
  return capitalizeHost(base.hostname);
}

function cleanTitle(raw: string): string {
  let t = raw.trim();
  // Strip common suffixes after a separator
  t = t.replace(/\s*[|\-–—:•·]\s*(home|welcome|official site|home page|start)\s*$/i, "");
  // Strip everything after first separator if it looks like a tagline
  const sepMatch = t.split(/\s+[|\-–—]\s+/);
  if (sepMatch.length > 1 && sepMatch[0].length >= 2) {
    t = sepMatch[0];
  }
  return t.trim();
}

function extractDescription(html: string): string | null {
  const og = matchMetaProperty(html, "og:description");
  if (og) return decodeEntities(og);
  const meta = matchMetaName(html, "description");
  if (meta) return decodeEntities(meta);
  return null;
}

function extractLogo(html: string, base: URL): string | null {
  const og = matchMetaProperty(html, "og:image");
  if (og) return resolveUrl(og, base);

  const iconHref = findLinkHref(html, /(?:^|\s)icon(?:\s|$)/i);
  if (iconHref) return resolveUrl(iconHref, base);

  return null;
}

function extractFavicon(html: string, base: URL): string {
  const iconHref = findLinkHref(html, /(?:^|\s)icon(?:\s|$)/i);
  if (iconHref) return resolveUrl(iconHref, base);
  return new URL("/favicon.ico", base).toString();
}

async function extractColor(html: string, base: URL): Promise<string> {
  // 1. theme-color meta
  const themeColor = matchMetaName(html, "theme-color");
  if (themeColor && isValidHex(themeColor.trim())) {
    return normalizeHex(themeColor.trim());
  }

  // 2. Most-used non-grayscale hex color in inline <style> + first linked stylesheet
  const inlineStyles = extractInlineStyles(html);
  let cssContent = inlineStyles;

  const firstStylesheet = findFirstStylesheet(html);
  if (firstStylesheet) {
    try {
      const absoluteCssUrl = resolveUrl(firstStylesheet, base);
      const css = await fetchText(absoluteCssUrl, STYLESHEET_TIMEOUT_MS);
      cssContent += "\n" + css;
    } catch {
      // ignore — skip if too slow / fails
    }
  }

  const dominant = pickDominantHex(cssContent);
  if (dominant) return dominant;

  // 3. Fallback
  return FALLBACK_COLOR;
}

function extractInlineStyles(html: string): string {
  const matches = html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi);
  let out = "";
  for (const m of matches) {
    out += m[1] + "\n";
  }
  return out;
}

function findFirstStylesheet(html: string): string | null {
  const re = /<link\b[^>]*>/gi;
  for (const m of html.matchAll(re)) {
    const tag = m[0];
    const relMatch = /\brel\s*=\s*["']?([^"'\s>]+)/i.exec(tag);
    if (!relMatch) continue;
    if (!/stylesheet/i.test(relMatch[1])) continue;
    const hrefMatch = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag);
    if (hrefMatch) return hrefMatch[1];
  }
  return null;
}

function pickDominantHex(css: string): string | null {
  const counts = new Map<string, number>();
  const re = /#([0-9a-fA-F]{3,8})\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    const raw = m[1];
    // accept #RGB, #RRGGBB; ignore #RRGGBBAA / #RGBA hex of length 4 or 8
    if (raw.length !== 3 && raw.length !== 6) continue;
    const hex = normalizeHex("#" + raw).toLowerCase();
    if (isGrayscale(hex)) continue;
    counts.set(hex, (counts.get(hex) || 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [hex, count] of counts) {
    if (count > bestCount) {
      best = hex;
      bestCount = count;
    }
  }
  return best;
}

function isGrayscale(hex: string): boolean {
  // hex like #rrggbb
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // Treat as grayscale if channels are within 8 of each other
  return max - min <= 8;
}

function isValidHex(s: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s);
}

function normalizeHex(hex: string): string {
  let h = hex.trim();
  if (!h.startsWith("#")) h = "#" + h;
  if (h.length === 4) {
    // Expand #abc → #aabbcc
    h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }
  return h.toLowerCase();
}

function matchMetaProperty(html: string, prop: string): string | null {
  const re = new RegExp(
    `<meta\\b[^>]*\\bproperty\\s*=\\s*["']${escapeRegex(prop)}["'][^>]*>`,
    "i",
  );
  const m = re.exec(html);
  if (!m) return null;
  return extractContent(m[0]);
}

function matchMetaName(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta\\b[^>]*\\bname\\s*=\\s*["']${escapeRegex(name)}["'][^>]*>`,
    "i",
  );
  const m = re.exec(html);
  if (!m) return null;
  return extractContent(m[0]);
}

function extractContent(tag: string): string | null {
  const m = /\bcontent\s*=\s*["']([^"']*)["']/i.exec(tag);
  return m ? m[1] : null;
}

function findLinkHref(html: string, relPattern: RegExp): string | null {
  const re = /<link\b[^>]*>/gi;
  for (const m of html.matchAll(re)) {
    const tag = m[0];
    const relMatch = /\brel\s*=\s*["']([^"']+)["']/i.exec(tag);
    if (!relMatch) continue;
    if (!relPattern.test(relMatch[1])) continue;
    const hrefMatch = /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag);
    if (hrefMatch) return hrefMatch[1];
  }
  return null;
}

function resolveUrl(href: string, base: URL): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function capitalizeHost(host: string): string {
  const parts = host.replace(/^www\./, "").split(".");
  const name = parts[0] || host;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function buildFallback(url: URL): DetectResult {
  return {
    company: capitalizeHost(url.hostname),
    color: FALLBACK_COLOR,
    logo: null,
    favicon: new URL("/favicon.ico", url).toString(),
    description: null,
    url: url.toString(),
  };
}
