import type { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../../auth/authenticated";
import { promises as fs } from "fs";
import { postImagePath } from "../../../../../server/post";

export const SUGGEST_TAGS_ENDPOINT = process.env["SUGGEST_TAGS_ENDPOINT"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();
  if (!isAuthenticated(req, res)) return res.status(401).end();
  if (!SUGGEST_TAGS_ENDPOINT) return res.status(500).end();

  const body = new FormData();
  const postID = parseInt(req.query["post-id"] as string);
  const buffer = await fs.readFile(postImagePath(postID));
  body.set("image", new Blob([buffer]));

  const results = await fetch(SUGGEST_TAGS_ENDPOINT, { method: "POST", body });
  return res.status(200).json(await results.json());
}
