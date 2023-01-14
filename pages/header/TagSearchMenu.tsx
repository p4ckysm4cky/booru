import React, { PropsWithChildren, useEffect, useState } from "react";
import styles from "./TagSearchMenu.module.css";
import { TagsSuggestResponse } from "../api/types";

export const TagSearchInputProps: React.InputHTMLAttributes<HTMLInputElement> =
  {
    type: "text",
    autoComplete: "off",
    autoCapitalize: "none",
    spellCheck: "false",
  };

export const TagSearchContainer = ({ children }: PropsWithChildren<{}>) => {
  return <div className={styles.container}>{children}</div>;
};

async function getSuggestions(prefix: string): Promise<TagsSuggestResponse> {
  const response = await fetch(`/api/tags/suggest?string=${prefix}`);
  return await response.json();
}

export const TagSearchMenu = ({
  prefix,
  onSelect,
}: {
  prefix: string;
  onSelect: (string: string) => void;
}) => {
  const [suggestions, setSuggestions] = useState<TagsSuggestResponse>([]);
  useEffect(() => {
    (async () => {
      const results = await getSuggestions(prefix);
      setSuggestions(results);
    })();
  }, [prefix]);

  return (
    suggestions && (
      <dl className={styles.menu}>
        {suggestions.map(({ string, post_count }) => (
          <dt
            key={string}
            className={styles.menuItem}
            onClick={() => onSelect(string)}
          >
            {string} - {post_count}
          </dt>
        ))}
      </dl>
    )
  );
};
