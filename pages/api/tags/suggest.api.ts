import type { NextApiRequest, NextApiResponse } from "next";
import { DB } from "../../../server/database";
import { TagsSuggestResponse } from "../types";

const STRING_MINIMUM_LENGTH = 2;
const SUGGESTION_LIMIT = 10;

function suggestTags(string: string): TagsSuggestResponse {
  if (string.length < STRING_MINIMUM_LENGTH) {
    return [];
  }

  return DB.prepare(
    `SELECT string, COUNT(post_id) AS post_count
       FROM tags
                JOIN post_tags ON tags.id = post_tags.tag_id
       WHERE string LIKE ?
       GROUP BY string
       ORDER BY COUNT(post_id) DESC, string
       LIMIT ?`,
  ).all(`${string}%`, SUGGESTION_LIMIT);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagsSuggestResponse>,
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const tag = req.query["string"] as string;
  res.status(200).json(suggestTags(tag));
}
