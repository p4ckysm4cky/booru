import { DB } from "./database";
import { getCanonicalTagName } from "./danbooru";
import { getMetadata } from "meta-png";
import { asyncMap } from "./utility";

async function checkPlausibleTag(tag: string): Promise<string | null> {
  // Ensure non-empty.
  if (!tag.trim()) {
    return null;
  }

  // Check if tag exists in local database.
  if (
    DB.prepare(
      `SELECT *
           FROM tags
           WHERE string = ?`,
    ).get(tag)
  ) {
    return tag;
  }

  // Check if tag exists in Danbooru.
  return await getCanonicalTagName(tag);
}

interface TagExtraction {
  // Tags that are guaranteed to be valid.
  tags: string[];
  // Tags that may be valid.
  plausible: string[];
}

function tryExtractNovelAITags(image: Buffer): TagExtraction | null {
  try {
    if (getMetadata(image, "Software") !== "NovelAI") {
      return null;
    }

    const plausible = getMetadata(image, "Description")!
      .split(",")
      .map((token) => token.trim().replaceAll(" ", "_"))
      .filter((tag) => !["masterpiece", "best_quality"].includes(tag));
    return { tags: ["novelai"], plausible };
  } catch (_error) {
    return null;
  }
}

export async function extractTags(image: Buffer): Promise<string[]> {
  const empty = { tags: [], plausible: [] };
  const { tags, plausible } = tryExtractNovelAITags(image) || empty;
  const valid = await asyncMap(plausible, (tag) => checkPlausibleTag(tag));
  return [...tags, ...valid.flatMap((tag) => (tag ? [tag] : []))];
}
