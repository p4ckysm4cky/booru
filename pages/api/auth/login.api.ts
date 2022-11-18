import Cookies from "cookies";
import { sign as jwtSign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { LoginResponse } from "../types";
import { TOKEN_COOKIE_NAME } from "./authenticated";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>,
) {
  if (req.method != "POST") {
    return res.status(405).end();
  }

  if (!process.env.SECRET) {
    const error = "$SECRET environment variable has not been set";
    return res.json({ error });
  }

  if (!process.env.PASSWORD) {
    const error = "$PASSWORD environment variable has not been set";
    return res.json({ error });
  }

  if (req.body.password !== process.env.PASSWORD) {
    const error = "Invalid password";
    return res.json({ error });
  }

  // Register cookie.
  const token = jwtSign({}, process.env.SECRET, { expiresIn: "30d" });
  new Cookies(req, res).set(TOKEN_COOKIE_NAME, token, { sameSite: "strict" });
  res.json({});
}
