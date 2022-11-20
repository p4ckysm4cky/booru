import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { TOKEN_COOKIE_NAME } from "./authenticated";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") return res.status(405).end();
  const cookies = new Cookies(req, res);
  cookies.set(TOKEN_COOKIE_NAME, null);
  res.json({});
}
