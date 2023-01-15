import { AlertError } from "./AlertError";
import Head from "next/head";
import { ServerProps } from "./_app.page";
import { serverProps } from "./_server";
import { useState } from "react";
import { LoginResponse } from "./api/types";
import { useRouter } from "next/router";
import { NextPage } from "next";

interface PageProps {}

export const getServerSideProps: ServerProps<PageProps> = serverProps(
  async () => {
    return {
      props: {},
    };
  },
);

const LoginPage: NextPage<PageProps> = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div style={{ textAlign: "center" }}>
        {error && <AlertError>{error}</AlertError>}
        <h2>Login</h2>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target as HTMLFormElement);
            const body = new URLSearchParams(formData as any);
            const data = await fetch("/api/auth/login", {
              method: "POST",
              body,
            });

            const response: LoginResponse = await data.json();
            if (response.error) {
              setError(response.error);
              return;
            }

            // Return to home page.
            await router.push("/");
          }}
        >
          <div>
            <input
              style={{ width: "24rem" }}
              name="password"
              type="password"
              placeholder="Password"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
