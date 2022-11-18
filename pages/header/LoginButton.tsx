import { NavigationItem } from "./NavigationItem";
import { Authenticated } from "../_app.page";
import { useRouter } from "next/router";

export const LoginButton = () => {
  const router = useRouter();
  return (
    <Authenticated.Consumer>
      {(authenticated) =>
        authenticated ? (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await fetch("/api/auth/logout", { method: "POST" });
              await router.push("/");
            }}
          >
            <button type={"submit"}>Logout</button>
          </form>
        ) : (
          <NavigationItem href={"/login"}>Login</NavigationItem>
        )
      }
    </Authenticated.Consumer>
  );
};
