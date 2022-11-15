import Cookies from "cookies";
import { verify as jwtVerify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage, ServerResponse } from "http";

export const TOKEN_COOKIE_NAME = "token";

export function isAuthenticated(req: IncomingMessage, res: ServerResponse) {
  const cookies = new Cookies(req, res);
  const token = cookies.get(TOKEN_COOKIE_NAME);

  try {
    jwtVerify(token!, process.env.SECRET!);
    return true;
  } catch (_error) {
    return false;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ authenticated: isAuthenticated(req, res) });
}
