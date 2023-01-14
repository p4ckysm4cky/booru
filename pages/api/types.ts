export type LoginResponse = { error?: string };
export type UploadResponse = { postID: number };
export type UploadDuplicateResponse = { message: string; postID: number };
export type TagsSuggestResponse = { string: string; post_count: number }[];
