import { DB } from "../../../server/database";
import styles from "./index.page.module.scss";
import Head from "next/head";
import { Authenticated, ServerProps } from "../../_app.page";
import { serverProps } from "../../_server";
import { NextPage } from "next";
import { Tag, TagsList } from "./TagsList";
import { ArchiveAction } from "./ArchiveAction";
import { SUGGEST_TAGS_ENDPOINT } from "../../api/post/[post-id]/tags/suggest.api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

interface PageProps {
  postID: number;
  created_at: string;
  tags: Tag[];
  canSuggestTags: boolean;
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
                 WHERE post_id = ?)
                    JOIN post_tags on id = post_tags.tag_id
           GROUP BY id, string
           ORDER BY string`,
    ).all(postID);

    return {
      props: {
        postID,
        created_at: post.created_at,
        tags,
        canSuggestTags: !!SUGGEST_TAGS_ENDPOINT,
      },
    };
  },
);

const PostPage: NextPage<PageProps> = ({
  postID,
  created_at,
  tags,
  canSuggestTags,
}) => {
  const tagSummary = tags.map((tag) => tag.string).join(" ");
  dayjs.extend(utc);
  return (
    <>
      <Head>
        <title>{tagSummary}</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.metaColumn}>
          <TagsList
            postID={postID}
            tags={tags}
            canSuggestTags={canSuggestTags}
          />
          <div>
            <h3>Information</h3>
            <dl>
              <dt>ID: {postID}</dt>
              <dt>Date: {dayjs().to(dayjs.utc(created_at))}</dt>
            </dl>
          </div>
          <Authenticated.Consumer>
            {(authenticated) =>
              authenticated && (
                <div>
                  <h3>Archival</h3>
                  <ArchiveAction postID={postID} />
                </div>
              )
            }
          </Authenticated.Consumer>
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
