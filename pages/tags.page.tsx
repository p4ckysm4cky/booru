import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { DB } from "../server/database";
import { serverProps, ServerProps } from "./_app.page";
import { PageNavigation } from "./PageNavigation";
import styles from "./tags.page.module.scss";

const DEFAULT_POST_LIMIT = 50;
interface Tag {
  id: number;
  string: string;
  post_count: number;
}

interface PageProps {
  tags: Tag[];
  page: number;
  pages: number;
}

export const getServerSideProps: ServerProps<PageProps> = serverProps(
  async ({ query }) => {
    const page = parseInt((query["page"] || 1) as string);
    // Page is 1-indexed but offset is 0-indexed
    const offset = (page - 1) * DEFAULT_POST_LIMIT;
    const tags = DB.prepare(
      `SELECT id, string, COUNT(post_id) AS post_count
        FROM tags
        JOIN post_tags ON tags.id=post_tags.tag_id
        GROUP BY string
        ORDER BY post_count DESC, string
        LIMIT ? OFFSET ?`,
    ).all(DEFAULT_POST_LIMIT, offset);
    const totalTags = DB.prepare(`SELECT COUNT(*) total_tags FROM tags`).get()
      .total_tags;
    const pages = Math.ceil(totalTags / DEFAULT_POST_LIMIT);
    return {
      props: {
        tags,
        page,
        pages,
      },
    };
  },
);

export const TagTableRow = ({ tag }: { tag: Tag }) => {
  return (
    <tr>
      <td>
        <Link href={`/?search=${tag.string}`} className={styles.tagLink}>
          {tag.string}
        </Link>
      </td>
      <td>{tag.post_count}</td>
    </tr>
  );
};

const TagsPage: NextPage<PageProps> = ({ tags, page, pages }) => {
  return (
    <>
      <Head>
        <title>Tags</title>
      </Head>
      <h1 style={{ textAlign: "center" }}>Tags</h1>
      <table className={styles.tagsTable}>
        {/* Removing tbody will crash the page*/}
        <tbody>
          <tr>
            <th>Name</th>
            <th>Posts</th>
          </tr>
          {tags.map((tag) => (
            <TagTableRow key={tag.id} tag={tag} />
          ))}
        </tbody>
      </table>
      <PageNavigation page={page} pages={pages} pageUrl={"tags"} />
    </>
  );
};

export default TagsPage;
