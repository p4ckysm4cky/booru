import { DB } from "../../../server/database";
import styles from "./index.page.module.scss";
import Head from "next/head";
import { serverProps, ServerProps } from "../../_app.page";
import { NextPage } from "next";
import { Tag, TagsList } from "./TagsList";
import dayjs from "dayjs";

interface PageProps {
  postID: number;
  created_at: string;
  tags: Tag[];
}

export const getServerSideProps: ServerProps<PageProps> = serverProps(
  async ({ query }) => {
    const postID = parseInt(query["post-id"] as string);
    const post = DB.prepare(
      `SELECT created_at
           FROM posts
           WHERE id = ?`,
    ).get(postID);

    const tags = DB.prepare(
      `SELECT id, string, COUNT(post_id) AS post_count
           FROM (SELECT id, string
                 FROM tags
                          JOIN post_tags on tags.id = post_tags.tag_id
                 WHERE post_id = ?
                 ORDER BY string)
                    JOIN post_tags on id = post_tags.tag_id
           GROUP BY id, string`,
    ).all(postID);

    return {
      props: {
        postID,
        created_at: post.created_at,
        tags,
      },
    };
  },
);

const PostPage: NextPage<PageProps> = ({ postID, created_at, tags }) => {
  const tagSummary = tags.map((tag) => tag.string).join(" ");
  return (
    <>
      <Head>
        <title>{tagSummary}</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.metaColumn}>
          <TagsList postID={postID} tags={tags} />
          <div>
            <h3>Information</h3>
            <dl>
              <dt>ID: {postID}</dt>
              <dt>Date: {dayjs().to(created_at)}</dt>
            </dl>
          </div>
        </div>
        <div className={styles.imageColumn}>
          <img
            className={styles.image}
            src={`/api/post/${postID}/raw`}
            alt={tagSummary}
          />
        </div>
        <div className={styles.spaceColumn}></div>
      </div>
    </>
  );
};

export default PostPage;
