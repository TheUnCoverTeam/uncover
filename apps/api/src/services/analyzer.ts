import type { ScrapedPost } from "./scraper.js";
import { filterNSFWContent } from "../lib/credits.js";

export interface AnalyzedResult {
  problems: Array<{
    text: string;
    frequency: number;
    sentiment: "frustrated" | "confused" | "disappointed" | "neutral";
    count: number; // how many posts mentioned this
  }>;
  summary: string;
  trends: string[];
}

const AI_PROVIDER = process.env.AI_PROVIDER || "groq";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "llama-3.1-8b-instant";

const BASE_URLS: Record<string, string> = {
  groq: "https://api.groq.com/openai/v1",
  openrouter: "https://openrouter.ai/api/v1",
  ollama: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
};

async function callAI(prompt: string, maxTokens = 1500): Promise<string> {
  const baseUrl = BASE_URLS[AI_PROVIDER] ?? BASE_URLS.groq;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${AI_API_KEY}`,
  };

  if (AI_PROVIDER === "openrouter") {
    headers["HTTP-Referer"] = "https://uncover.dev";
    headers["X-Title"] = "Uncover API";
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.2, // lower = more consistent
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI API error (${response.status}): ${err}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content ?? "";
}

function deduplicateProblems(problems: AnalyzedResult["problems"]): AnalyzedResult["problems"] {
  // Simple dedup: merge problems with very similar text (first 40 chars match)
  const seen = new Map<string, (typeof problems)[0]>();

  for (const p of problems) {
    const key = p.text.toLowerCase().slice(0, 40).trim();
    const existing = seen.get(key);
    if (existing) {
      // Keep the one with higher frequency
      if (p.frequency > existing.frequency) {
        seen.set(key, p);
      }
    } else {
      seen.set(key, p);
    }
  }

  return Array.from(seen.values())
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);
}

export async function analyzeProblems(
  posts: ScrapedPost[],
  topic: string
): Promise<AnalyzedResult> {
  if (posts.length === 0) {
    return {
      problems: [],
      summary: "No posts found to analyze. Try broadening your search or using different sources.",
      trends: [],
    };
  }

  // Filter NSFW content before sending to AI
  const safePosts = posts.filter(p => filterNSFWContent(`${p.title} ${p.text}`));

  if (safePosts.length === 0) {
    return {
      problems: [],
      summary: "Search results were filtered due to content policy.",
      trends: [],
    };
  }

  // Truncate posts to fit context — keep highest upvoted ones
  const topPosts = safePosts
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 30);

  const postsText = topPosts
    .map((p, i) => {
      const upvoteInfo = p.upvotes > 0 ? ` — ${p.upvotes} upvotes` : "";
      const subredditInfo = p.subreddit ? ` — r/${p.subreddit}` : "";
      return `[Post ${i + 1}${upvoteInfo}${subredditInfo}]\nTitle: ${p.title}\n${p.text ? `Body: ${p.text.slice(0, 500)}` : ""}`;
    })
    .join("\n\n---\n\n");

  const prompt = `You are a product researcher analyzing social media posts to identify genuine user pain points about "${topic}".

Analyze these ${topPosts.length} posts and extract the REAL, SPECIFIC problems users mention:

${postsText}

Rules for extracting problems:
1. Be SPECIFIC — "App crashes on iOS 17 when uploading photos" not "App has bugs"
2. Base frequency on how many posts actually mention this issue (1-10 scale relative to this dataset)
3. Only include genuine problems users experienced — not opinions or feature requests
4. Merge near-duplicate problems into one
5. Ignore off-topic posts, memes, jokes

Return ONLY valid JSON, no markdown, no explanation:
{
  "problems": [
    {
      "text": "specific problem description (max 100 chars)",
      "frequency": 7,
      "sentiment": "frustrated",
      "count": 4
    }
  ],
  "summary": "2-3 sentence factual summary of the main issues found. Be specific, cite the most common problems.",
  "trends": ["trend1", "trend2", "trend3"]
}

Sentiment must be one of: frustrated, confused, disappointed, neutral
frequency is 1-10 based on how often it appears relative to all posts
count is the approximate number of posts mentioning this specific problem
Extract 5-10 distinct, specific problems. If fewer than 5 genuine problems exist, return only what's real.`;

  try {
    const responseText = await callAI(prompt, 1500);

    const cleaned = responseText
      .replace(/^```json\s*/m, "")
      .replace(/^```\s*/m, "")
      .replace(/```\s*$/m, "")
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");

    const parsed = JSON.parse(jsonMatch[0]) as AnalyzedResult;

    // Deduplicate and validate
    parsed.problems = deduplicateProblems(parsed.problems || []);

    // Validate sentiment values
    const validSentiments = new Set(["frustrated", "confused", "disappointed", "neutral"]);
    parsed.problems = parsed.problems.map(p => ({
      ...p,
      sentiment: validSentiments.has(p.sentiment) ? p.sentiment : "neutral" as any,
      frequency: Math.min(10, Math.max(1, p.frequency || 1)),
      count: p.count || 1,
    }));

    return parsed;
  } catch (error) {
    console.error("AI analysis error:", error);
    throw error;
  }
}
