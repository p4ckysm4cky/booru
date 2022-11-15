import useSWR from "swr";
import { NavigationItem } from "./NavigationItem";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

export const LoginButton = () => {
  // FIXME: migrate away from SWR to avoid flashing
  const { data, error } = useSWR<{ authenticated: boolean }>(
    "/api/authenticated",
    fetcher,
  );

  if (error) {
    // FIXME: navigation items have a max size of 6rem for some reason?
    // This makes this wrap considerably.
    console.error(error);
    return (
      <NavigationItem href="#">Failed to load login button</NavigationItem>
    );
  }

  if (!data) {
    return <NavigationItem href="#">Loading...</NavigationItem>;
  }

  return data.authenticated ? (
    <NavigationItem href={"/api/logout"}>Logout</NavigationItem>
  ) : (
    <NavigationItem href={"/login"}>Login</NavigationItem>
  );
};
