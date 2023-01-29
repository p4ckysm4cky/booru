import "normalize.css/normalize.css";
import "sakura.css/css/sakura-vader.css";
import "./globals.scss";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Header } from "./header/Header";
import { GetServerSideProps } from "next";
import React from "react";
import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

// Global initialization.
dayjs.extend(relativeTime);
dayjs.extend(utc);

// Page types.
type HigherProps<P> = { props: P; authenticated: boolean };
export type ServerProps<P> = GetServerSideProps<HigherProps<P>>;
export const Authenticated = React.createContext<boolean | null>(null);

export default function App({ Component, pageProps }: AppProps) {
  // Force data reload on fast linking:
  // https://github.com/vercel/next.js/discussions/22512#discussioncomment-1779505
  const router = useRouter();
  return (
    <div key={router.asPath}>
      {process.env.NEXT_PUBLIC_NO_INDEX && (
        <Head>
          <meta name={"robots"} content={"noindex"} />
        </Head>
      )}
      <Authenticated.Provider value={pageProps.authenticated}>
        <Header />
        <Component {...pageProps} />
      </Authenticated.Provider>
    </div>
  );
}
