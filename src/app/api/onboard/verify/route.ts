/**
 * POST /api/onboard/verify
 *
 * Verifies that the LeadTrackBack widget script tag is installed on a customer's website.
 * Given a `{ url }` payload, fetches the page HTML and searches for the widget
 * script (`leadtrackback.vercel.app/widget/leadwidget.js`). When found, also
 * extracts the `data-company` and `data-color` attributes from the script tag.
 *
 * Used by the onboarding wizard's "Verify installation" step.
 */

import { optionsResponse, jsonResponse } from "../../widget/cors";

const WIDGET_HOST_PATH = "leadtrackback.vercel.app/widget/leadwidget.js";
const USER_AGENT = "Mozilla/5.0 (LeadTrackBack)";
const FETCH_TIMEOUT_MS = 10000;

const NOT_INSTALLED_HINT =
  "Make sure the script tag is in your site's <body> and that you've published your changes.";

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

  if (!/^https?:$/.test(parsed.protocol)) {
    return jsonResponse({ error: "only http(s) URLs are allowed" }, request, 400);
  }
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host)
  ) {
    return jsonResponse({ error: "localhost and IP addresses are not allowed" }, request, 400);
  }

  let html: string;
  try {
    const res = await fetch(parsed.toString(), {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "follow",
    });
    if (!res.ok) {
      return jsonResponse(
        {
          installed: false,
          hint: `Could not load the page (status ${res.status}). Make sure the URL is publicly accessible and try again.`,
        },
        request,
      );
    }
    html = await res.text();
  } catch {
    return jsonResponse(
      {
        installed: false,
        hint: "Could not reach the URL. Verify it is publicly accessible and try again.",
      },
      request,
    );
  }

  if (!html.toLowerCase().includes(WIDGET_HOST_PATH)) {
    return jsonResponse(
      { installed: false, hint: NOT_INSTALLED_HINT },
      request,
    );
  }

  // Find the actual <script> tag with the widget src and pull data-* attributes
  const scriptTag = findWidgetScriptTag(html);
  const color = scriptTag ? getAttr(scriptTag, "data-color") : null;
  const company = scriptTag ? getAttr(scriptTag, "data-company") : null;

  const result: { installed: true; color?: string; company?: string } = {
    installed: true,
  };
  if (color) result.color = color;
  if (company) result.company = company;

  return jsonResponse(result, request);
}

function findWidgetScriptTag(html: string): string | null {
  const re = /<script\b[^>]*>/gi;
  for (const m of html.matchAll(re)) {
    const tag = m[0];
    const srcMatch = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(tag);
    if (!srcMatch) continue;
    if (srcMatch[1].toLowerCase().includes(WIDGET_HOST_PATH)) {
      return tag;
    }
  }
  return null;
}

function getAttr(tag: string, attr: string): string | null {
  const re = new RegExp(`\\b${escapeRegex(attr)}\\s*=\\s*["']([^"']*)["']`, "i");
  const m = re.exec(tag);
  return m ? m[1] : null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
