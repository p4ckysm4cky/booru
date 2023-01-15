import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../auth/authenticated";
import { DB } from "../../../../server/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") return res.status(405).end();
  if (!isAuthenticated(req, res)) return res.status(401).end();
  const postID = parseInt(req.query["post-id"] as string);

  // Delete post only if it is not already deleted.
  DB.prepare(
    `UPDATE posts_all
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE deleted_at IS NULL
         AND id = ?`,
  ).run(postID);

  return res.status(200).json({});
}
