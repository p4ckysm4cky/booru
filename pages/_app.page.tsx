import "normalize.css/normalize.css";
import "sakura.css/css/sakura-vader.css";
import "./globals.scss";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Header } from "./header/Header";
import { GetServerSideProps } from "next";
import { isAuthenticated } from "./api/auth/authenticated";
import React from "react";

type HigherProps<P> = { props: P; authenticated: boolean };
export type ServerProps<P> = GetServerSideProps<HigherProps<P>>;
export const Authenticated = React.createContext<boolean | null>(null);

export function serverProps<P extends object>(
  props: GetServerSideProps<P>,
): ServerProps<P> {
  return async (context) => {
    const result = (await props(context)) as any;
    result.props.authenticated = isAuthenticated(context.req, context.res);
    return result;
  };
}

export default function App({ Component, pageProps }: AppProps) {
  // Force data reload on fast linking:
  // https://github.com/vercel/next.js/discussions/22512#discussioncomment-1779505
  const router = useRouter();
  return (
    <div key={router.asPath}>
      <Authenticated.Provider value={pageProps.authenticated}>
        <Header />
        <Component {...pageProps} />
      </Authenticated.Provider>
    </div>
  );
}
