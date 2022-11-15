import { GetServerSideProps, NextPage } from "next";
import { DB } from "../../../server/database";
import moment from "moment";
import Link from "next/link";
import styles from "./index.page.module.scss";
import Head from "next/head";

interface PageProps {
  postID: number;
  created_at: string;
  tags: Tag[];
}

interface Tag {
  id: number;
  string: string;
  post_count: number;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
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
};

const TagItem = ({ tag }: { tag: Tag }) => {
  return (
    <dt>
      <Link className={styles.tagItemLink} href={`/?search=${tag.string}`}>
        {tag.string} - {tag.post_count}
      </Link>
    </dt>
  );
};

const PostPage: NextPage<PageProps> = ({ postID, created_at, tags }) => {
  const tagSummary = tags.map((tag) => tag.string).join(" ");
  return (
    <>
      <Head>
        <title>{tagSummary}</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.metaColumn}>
          <div>
            <h3 style={{ marginTop: 0 }}>Tags</h3>
            <dl>
              {tags.map((tag) => (
                <TagItem key={tag.id} tag={tag} />
              ))}
            </dl>
          </div>
          <div>
            <h3>Information</h3>
            <dl>
              <dt>ID: {postID}</dt>
              <dt>Date: {moment.utc(created_at).fromNow()}</dt>
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
