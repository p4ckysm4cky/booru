import "normalize.css/normalize.css";
import "sakura.css/css/sakura-vader.css";
import "./globals.scss";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Header } from "./header/Header";

export default function App({ Component, pageProps }: AppProps) {
  // Force data reload on fast linking:
  // https://github.com/vercel/next.js/discussions/22512#discussioncomment-1779505
  const router = useRouter();
  return (
    <div key={router.asPath}>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}
