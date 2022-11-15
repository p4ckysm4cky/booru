const DANBOORU_API = "https://danbooru.donmai.us";

export async function getTagByName(name: string): Promise<any> {
  return (await fetch(`${DANBOORU_API}/tags.json?search[name]=${name}`)).json();
}
