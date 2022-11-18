import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Buffer from "buffer";
import { generateThumbnailURL, insertPost } from "../../server/post";
import { extractTags } from "../../server/tag";
import { UploadResponse } from "./types";
import { isAuthenticated } from "./auth/authenticated";

export const config = {
  api: {
    bodyParser: false,
  },
};

const BODY_OPTIONS = {
  limit: "16mb",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>,
) {
  if (req.method !== "POST") return res.status(405).end();
  if (!isAuthenticated(req, res)) return res.status(401).end();

  try {
    // Generate data.
    const data = (await buffer(req, BODY_OPTIONS)) as Buffer;
    const thumbnailURL = await generateThumbnailURL(data);
    const tags = await extractTags(data);

    // Insert into database.
    const postID = await insertPost(data, thumbnailURL, tags);
    res.status(200).json({ postID });
  } catch (error: any) {
    res.status(error.statusCode || 500).end();
  }
}
