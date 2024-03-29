export type LoginResponse = { error?: string };
export type UploadResponse = { postID: number };
export type TagsSuggestResponse = { string: string; post_count: number }[];

export type PostGetResponse = {
  created_at: string;
  tags: { string: string }[];
};
