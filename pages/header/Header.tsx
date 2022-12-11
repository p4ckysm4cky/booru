import { PostSearchBox } from "./PostSearchBox";
import { NavigationItem } from "./NavigationItem";
import { LoginButton } from "./LoginButton";

const NavigationLeft = () => {
  return (
    <nav style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <NavigationItem href={"/"}>Home</NavigationItem>
      <NavigationItem href={"/tags"}>Tags</NavigationItem>
      <NavigationItem href={"/upload"}>Upload</NavigationItem>
    </nav>
  );
};

const NavigationRight = () => {
  return (
    <div style={{ marginLeft: "auto" }}>
      <LoginButton />
    </div>
  );
};

export const Header = () => {
  return (
    <header>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "2rem",
          margin: "1.5rem",
          alignItems: "center",
        }}
      >
        <NavigationLeft />
        <PostSearchBox />
        <NavigationRight />
      </div>
      <hr />
    </header>
  );
};
