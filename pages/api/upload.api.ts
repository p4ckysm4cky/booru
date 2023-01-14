import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  generateThumbnailURL,
  insertPost,
  getIdFromHash,
} from "../../server/post";
import { extractTags } from "../../server/tag";
import { UploadDuplicateResponse, UploadResponse } from "./types";
import { isAuthenticated } from "./auth/authenticated";
import md5 from "md5";

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
  res: NextApiResponse<UploadResponse | UploadDuplicateResponse>,
) {
  if (req.method !== "POST") return res.status(405).end();
  if (!isAuthenticated(req, res)) return res.status(401).end();

  try {
    // Generate data.
    const data = (await buffer(req, BODY_OPTIONS)) as Buffer;
    const imageHash = md5(data);
    // Check if image is already in database.
    const id = await getIdFromHash(imageHash);
    if (id !== null) {
      return res.status(409).json({ message: "Duplicate image", postID: id });
    }

    const thumbnailURL = await generateThumbnailURL(data);
    const tags = await extractTags(data);

    // Insert into database.
    const postID = await insertPost(data, thumbnailURL, imageHash, tags);
    res.status(200).json({ postID });
  } catch (error: any) {
    res.status(error.statusCode || 500).end();
  }
}
