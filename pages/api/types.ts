export type UploadResponse = { postID: number };
export type TagsSuggestResponse = { string: string; post_count: number }[];

export const AUTHENTICATION_MESSAGES = {
  INVALID_PASSWORD: "Invalid password",
  PASSWORD_UNSET: "$PASSWORD environment variable has not been set",
  SECRET_UNSET: "$SECRET environment variable has not been set",
};
