import path from "path";
import { asyncTransaction, DB } from "./database";
import { promises as fs } from "fs";
import { Database } from "better-sqlite3";
import sharp from "sharp";

export function postImagePath(postID: number): string {
  return path.join(
    process.env.DATA_ROOT ? process.env.DATA_ROOT : "data",
    "posts",
    postID.toString(),
  );
}

export async function generateThumbnailURL(data: Buffer): Promise<string> {
  const buffer = await sharp(data)
    .resize({
      // Maximum width.
      width: 384,
      // Maximum height.
      height: 384,
      // Do not exceed dimensions.
      fit: "inside",
      // Do not enlarge image.
      withoutEnlargement: true,
    })
    .jpeg({
      // Improved compression and quality.
      mozjpeg: true,
      // Ensure image can be progressively loaded.
      progressive: true,
      // Ensure image quality.
      quality: 80,
    })
    .toBuffer();

  // Encode as data URL.
  const encoded = buffer.toString("base64");
  return `data:image/jpeg;base64,${encoded}`;
}

function clearTags(db: Database, postID: number) {
  db.prepare(
    `DELETE
       FROM post_tags_all
       WHERE post_id = ?`,
  ).run(postID);
}

function insertPostTagsOrCreate(db: Database, postID: number, tags: string[]) {
  const selectTagID = db.prepare(
    `SELECT id
       FROM tags
       WHERE string = ?`,
  );

  const insertTag = db.prepare(
    `INSERT OR IGNORE INTO tags_all (string)
       VALUES (?)`,
  );
  const insertPostTag = db.prepare(
    `INSERT OR IGNORE INTO post_tags_all (post_id, tag_id)
       VALUES (?, ?)`,
  );

  // Create tags.
  for (const tag of tags) {
    insertTag.run(tag);
    const tagID = selectTagID.get(tag).id;
    insertPostTag.run(postID, tagID);
  }
}

export async function insertPost(
  data: Buffer,
  thumbnailURL: string,
  imageHash: string,
  tags: string[],
): Promise<number> {
  return await asyncTransaction(async (db) => {
    const insertPost = db.prepare(
      `INSERT INTO posts_all (thumbnail_url, image_md5)
         VALUES (?, ?)`,
    );

    const postID = insertPost.run(thumbnailURL, imageHash)
      .lastInsertRowid as number;
    await fs.writeFile(postImagePath(postID), data);
    insertPostTagsOrCreate(db, postID, tags);
    return postID;
  });
}

export function setPostTags(postID: number, tags: string[]) {
  DB.transaction(() => {
    clearTags(DB, postID);
    insertPostTagsOrCreate(DB, postID, tags);
  })();
}

export async function postIDFromHash(
  imageHash: string,
): Promise<number | null> {
  const post = DB.prepare(
    `SELECT id
       FROM posts
       WHERE image_md5 = ?`,
  ).get(imageHash);

  if (post === undefined) return null;
  return post.id as number;
}
