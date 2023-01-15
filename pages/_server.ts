import { GetServerSideProps } from "next";
import { isAuthenticated } from "./api/auth/authenticated";
import { ServerProps } from "./_app.page";

// This module must be kept separate from any client side modules as this
// transitively depends on the crypto module (for authentication) which
// includes a huge polyfill. See: https://github.com/vercel/next.js/issues/33791
export function serverProps<P extends object>(
  props: GetServerSideProps<P>,
): ServerProps<P> {
  return async (context) => {
    const result = (await props(context)) as any;
    result.props.authenticated = isAuthenticated(context.req, context.res);
    return result;
  };
}
