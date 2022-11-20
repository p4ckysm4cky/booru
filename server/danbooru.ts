import mem from "mem";

const DANBOORU_API = "https://danbooru.donmai.us";

async function getActiveTagByName(name: string): Promise<any | null> {
  const url = `${DANBOORU_API}/tags.json?search[name]=${name}`;
  const results = await (await fetch(url)).json();
  if (results.length !== 1) return null;

  const result = results[0];
  if (result.post_count === 0) return null;
  return result;
}

async function getActiveTagAlias(name: string): Promise<string | null> {
  const url = `${DANBOORU_API}/tag_aliases.json?search[antecedent_name]=${name}`;
  const results = await (await fetch(url)).json();
  if (results.length !== 1) return null;

  const result = results[0];
  if (result.status !== "active") return null;
  return result.consequent_name;
}

export const getCanonicalTagName = mem(
  async (name: string): Promise<string | null> => {
    // Tag aliases are automatically chained so no need to recurse:
    // https://danbooru.donmai.us/wiki_pages/help:tag_aliases
    const alias = await getActiveTagAlias(name);
    const tag = await getActiveTagByName(alias ?? name);
    return tag?.name;
  },
  {
    // Cache result for 1 day.
    maxAge: 24 * 60 * 60 * 1000,
  },
);
