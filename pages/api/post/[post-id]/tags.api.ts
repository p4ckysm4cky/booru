import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../auth/authenticated";
import { validateTag } from "../../../../server/tag";
import { setPostTags } from "../../../../server/post";
import { DB } from "../../../../server/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: return post tags on GET request
  if (req.method !== "POST") return res.status(405).end();
  if (!isAuthenticated(req, res)) return res.status(401).end();

  const postID = parseInt(req.query["post-id"] as string);
  const post = DB.prepare(
    `SELECT id
       FROM posts
       WHERE id = ?`,
  ).get(postID);

  // FIXME: race condition where the post is deleted before the tags are set;
  //        this is not critical as consistency is maintained at the schema level
  // Ensure post exists.
  if (!post) {
    return res.status(404).send(`Post not found: ${postID}`);
  }

  // Validate all tags.
  const tags = req.body as string[];
  for (const tag of tags) {
    if (!validateTag(tag)) {
      return res.status(422).send(`Invalid tag: ${tag}`);
    }
  }

  // Set tags.
  setPostTags(postID, tags);
  return res.status(200).json({});
}
