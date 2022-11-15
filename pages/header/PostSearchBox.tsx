import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { TagSearchContainer, TagSearchMenu } from "./TagSearchMenu";
import { lastIndexOfRegex } from "../../server/utility";
import styles from "./PostSearchBox.module.scss";

export const PostSearchBox = () => {
  const router = useRouter();
  const defaultQuery = router.query["search"] as string;
  const [query, setQuery] = useState(defaultQuery || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract last prefix.
  const splitIndex = lastIndexOfRegex(query, /\W/g);
  const existing = query.slice(0, splitIndex + 1);
  const prefix = query.slice(splitIndex + 1);

  return (
    <form
      action={"/"}
      method={"get"}
      className={styles.form}
      onSubmit={async (event) => {
        // Submit form faster if JS is enabled.
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        await router.push(`/?${new URLSearchParams(formData as any)}`);
      }}
    >
      <TagSearchContainer>
        <input
          ref={inputRef}
          className={styles.search}
          type={"text"}
          name={"search"}
          autoComplete={"off"}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <TagSearchMenu
          prefix={prefix}
          onSelect={(string) => {
            // Refocus after selection outside input box.
            inputRef.current!.focus();
            setQuery(existing + string + " ");
          }}
        />
      </TagSearchContainer>
      <button type={"submit"}>Search</button>
    </form>
  );
};
