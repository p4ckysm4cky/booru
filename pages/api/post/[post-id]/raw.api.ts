import type { NextApiRequest, NextApiResponse } from "next";
import { postImagePath } from "../../../../server/post";
import send, { SendOptions } from "send";

const OPTIONS: SendOptions = {
  // One year is the maximum safe resource age limit.
  maxAge: "1y",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  // FIXME: post is still accessible when archived
  try {
    const postID = parseInt(req.query["post-id"] as string);
    await new Promise((resolve, reject) => {
      send(req, postImagePath(postID), OPTIONS)
        .on("error", (error) => reject(error))
        .on("end", () => resolve({}))
        .pipe(res);
    });
  } catch (error: any) {
    res.status(error.status || 500).end();
  }
}
