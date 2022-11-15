import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { TOKEN_COOKIE_NAME } from "./authenticated.api";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  cookies.set(TOKEN_COOKIE_NAME, null);
  res.redirect("/");
}
