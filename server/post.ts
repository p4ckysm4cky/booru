import path from "path";
import { asyncTransaction } from "./database";
import { promises as fs } from "fs";
import { Database } from "better-sqlite3";
import sharp from "sharp";

export function postImagePath(postID: number): string {
  return path.join("data", "posts", postID.toString());
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

function insertTags(db: Database, postID: number, tags: string[]) {
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
    `INSERT OR IGNORE INTO post_tags (post_id, tag_id)
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
  tags: string[],
): Promise<number> {
  return await asyncTransaction(async (db) => {
    const insertPost = db.prepare(
      `INSERT INTO posts_all (thumbnail_url)
         VALUES (?)`,
    );

    const postID = insertPost.run(thumbnailURL).lastInsertRowid as number;
    await fs.writeFile(postImagePath(postID), data);
    insertTags(db, postID, tags);
    return postID;
  });
}
