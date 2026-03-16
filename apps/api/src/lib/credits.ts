/**
 * Credit cost calculator and content safety guards.
 *
 * Pricing logic:
 * - Base: 1 credit for 1 source, up to 10 posts
 * - +1 per additional source
 * - +1 per additional 10 posts (so 20 posts = +1, 30 posts = +2, etc.)
 * - +1 per active filter (minUpvotes, maxAge, excludeKeywords, excludeSubreddits)
 * - Custom URLs: base 2, +1 per URL above 1, max 10
 */

export interface CreditCostInput {
  sources?: string[];
  urls?: string[];
  limit: number;
  options?: {
    excludeSubreddits?: string[];
    excludeKeywords?: string[];
    minUpvotes?: number;
    maxAgeHours?: number;
  };
}

export function calculateCreditCost(input: CreditCostInput): number {
  const isCustom = !!(input.urls && input.urls.length > 0);

  if (isCustom) {
    const urlCount = Math.min(input.urls!.length, 5);
    // Base 2 + 1 per extra URL
    return Math.min(2 + (urlCount - 1), 10);
  }

  const sources = input.sources ?? ["reddit"];
  const sourceCount = Math.max(1, sources.length);
  const postTiers = Math.floor((input.limit - 1) / 10); // 1-10=0, 11-20=1, 21-30=2, etc.

  let filterCount = 0;
  if (input.options?.minUpvotes && input.options.minUpvotes > 0) filterCount++;
  if (input.options?.maxAgeHours) filterCount++;
  if (input.options?.excludeKeywords?.length) filterCount++;
  if (input.options?.excludeSubreddits?.length) filterCount++;

  const cost = 1 + (sourceCount - 1) + postTiers + Math.floor(filterCount / 2);
  return Math.min(Math.max(1, cost), 20); // cap at 20 for social
}

// ── NSFW and content safety ───────────────────────────────────────────────────

const NSFW_KEYWORDS = new Set([
  // Sexual
  "porn", "pornography", "xxx", "nsfw", "nude", "nudes", "naked", "sex tape",
  "onlyfans", "escort", "prostitut", "camgirl", "hentai", "erotic",
  // Violence
  "gore", "snuff", "torture", "beheading", "murder how to", "kill myself",
  "suicide method", "how to die",
  // Drugs (specific synthesis/acquisition)
  "drug synthesis", "how to make meth", "fentanyl recipe", "darknet market",
  "buy cocaine", "drug dealer",
  // Hate
  "white supremac", "neo nazi", "racial slur",
  // Weapons
  "make a bomb", "build a gun", "illegal weapon",
]);

const BLOCKED_QUERY_PATTERNS = [
  /\b(how\s+to\s+(kill|murder|poison|hack|ddos|stalk))\b/i,
  /\b(buy\s+(drugs|weapons|guns|explosives))\b/i,
  /\b(child|minor|underage)\s+(sex|porn|nude|naked)\b/i,
  /\b(n[i1]gg[ae]r|ch[i1]nk|sp[i1]c|k[i1]ke|f[a4]gg[o0]t)\b/i,
];

export interface ContentCheckResult {
  allowed: boolean;
  reason?: string;
}

export function checkQuerySafety(query: string): ContentCheckResult {
  const lower = query.toLowerCase().trim();

  // Too short
  if (lower.length < 3) {
    return { allowed: false, reason: "Query too short — minimum 3 characters" };
  }

  // Too long
  if (query.length > 200) {
    return { allowed: false, reason: "Query too long — maximum 200 characters" };
  }

  // NSFW keywords
  for (const kw of NSFW_KEYWORDS) {
    if (lower.includes(kw)) {
      return { allowed: false, reason: "Query contains prohibited content" };
    }
  }

  // Pattern matching
  for (const pattern of BLOCKED_QUERY_PATTERNS) {
    if (pattern.test(lower)) {
      return { allowed: false, reason: "Query contains prohibited content" };
    }
  }

  return { allowed: true };
}

// Filter NSFW content from scraped posts
const NSFW_POST_PATTERNS = [
  /\b(porn|xxx|nude|naked|nsfw|onlyfans|escort)\b/i,
  /\b(n[i1]gg[ae]r|ch[i1]nk|sp[i1]c|k[i1]ke)\b/i,
];

export function filterNSFWContent(text: string): boolean {
  // Returns true if content should be KEPT (is safe)
  return !NSFW_POST_PATTERNS.some(p => p.test(text));
}

// Sanitize query — strip potential injection/manipulation attempts
export function sanitizeQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>{}[\]\\]/g, "") // strip brackets/braces
    .replace(/\s+/g, " ")        // normalize whitespace
    .slice(0, 200);               // hard cap
}
