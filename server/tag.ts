import { DB } from "./database";
import * as danbooru from "./danbooru";
import { getMetadata } from "meta-png";
import { asyncFilter } from "./utility";

async function checkPlausibleTag(tag: string): Promise<boolean> {
  // Ensure non-empty.
  if (!tag.trim()) {
    return false;
  }

  // Check if tag exists in local database.
  if (
    DB.prepare(
      `SELECT *
           FROM tags
           WHERE string = ?`,
    ).get(tag)
  ) {
    return true;
  }

  // Check if tag exists in Danbooru.
  if (await danbooru.getTagByName(tag)) {
    return true;
  }

  // Tag name is not plausible.
  return false;
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

    const tokens = getMetadata(image, "Description")!.split(",");
    const plausible = tokens.map((token) => token.trim().replaceAll(" ", "_"));
    return { tags: ["novelai"], plausible };
  } catch (_error) {
    return null;
  }
}

export async function extractTags(image: Buffer): Promise<string[]> {
  const empty = { tags: [], plausible: [] };
  const { tags, plausible } = tryExtractNovelAITags(image) || empty;
  const valid = await asyncFilter(plausible, (tag) => checkPlausibleTag(tag));
  return [...tags, ...valid];
}
