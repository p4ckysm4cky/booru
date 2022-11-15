import { GetServerSideProps, NextPage } from "next";
import { AUTHENTICATION_MESSAGES } from "./api/types";
import { AlertError } from "./AlertError";
import Head from "next/head";

interface PageProps {
  error: string | null;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
  const errorCode = query["error"] as
    | keyof typeof AUTHENTICATION_MESSAGES
    | undefined;

  return {
    props: {
      error: errorCode ? AUTHENTICATION_MESSAGES[errorCode] : null,
    },
  };
};

const LoginPage: NextPage<PageProps> = ({ error }) => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div style={{ textAlign: "center" }}>
        {error && <AlertError>{error}</AlertError>}
        <h2>Login</h2>
        <form action={"/api/login"} method={"post"}>
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
