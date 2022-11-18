import Cookies from "cookies";
import { verify as jwtVerify } from "jsonwebtoken";
import { IncomingMessage, ServerResponse } from "http";

export const TOKEN_COOKIE_NAME = "token";

export function isAuthenticated(
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  const cookies = new Cookies(req, res);
  const token = cookies.get(TOKEN_COOKIE_NAME);

  try {
    jwtVerify(token!, process.env.SECRET!);
    return true;
  } catch (_error) {
    return false;
  }
}
