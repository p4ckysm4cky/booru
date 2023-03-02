import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../auth/authenticated";
import { DB } from "../../../../server/database";
import { PostGetResponse } from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostGetResponse | {}>,
) {
  const postID = parseInt(req.query["post-id"] as string);
  if (req.method === "GET") {
    const post = DB.prepare(
      `SELECT created_at
         FROM posts
         WHERE id = ?`,
    ).get(postID);

    const tags = DB.prepare(
      `SELECT string
         FROM tags
                  JOIN post_tags on tags.id = post_tags.tag_id
         WHERE post_id = ?
         ORDER BY string`,
    ).all(postID);

    return res.status(200).json({
      created_at: post.created_at,
      tags,
    });
  } else if (req.method === "DELETE") {
    if (!isAuthenticated(req, res)) {
      return res.status(401).end();
    }

    // Delete post only if it is not already deleted.
    DB.prepare(
      `UPDATE posts_all
         SET deleted_at = CURRENT_TIMESTAMP
         WHERE deleted_at IS NULL
           AND id = ?`,
    ).run(postID);

    return res.status(200).json({});
  } else {
    return res.status(405).end();
  }
}
