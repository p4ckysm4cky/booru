import Cookies from "cookies";
import { sign as jwtSign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { AUTHENTICATION_MESSAGES } from "./types";
import { TOKEN_COOKIE_NAME } from "./authenticated.api";

function errorRedirect(
  res: NextApiResponse,
  errorCode: keyof typeof AUTHENTICATION_MESSAGES,
) {
  // FIXME: find a way to pass the error code without filling up the user's history.
  return res.redirect(`/login?error=${errorCode}`);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") return res.status(405).end();
  if (!process.env.PASSWORD) return errorRedirect(res, "PASSWORD_UNSET");
  if (!process.env.SECRET) return errorRedirect(res, "SECRET_UNSET");

  if (req.body.password == process.env.PASSWORD) {
    const token = jwtSign({}, process.env.SECRET, { expiresIn: "30d" });
    new Cookies(req, res).set(TOKEN_COOKIE_NAME, token, { sameSite: "strict" });
    res.redirect("/");
  } else {
    errorRedirect(res, "INVALID_PASSWORD");
  }
}
