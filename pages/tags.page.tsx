import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { DB } from "../server/database";
import { serverProps, ServerProps } from "./_app.page";
import styles from "./tags.page.module.scss";

interface Tag {
  id: number;
  string: string;
  post_count: number;
}

interface PageProps {
  tags: Tag[];
}

export const getServerSideProps: ServerProps<PageProps> = serverProps(
  async () => {
    // FIXME: Add limit once pagination is fixed
    const tags = DB.prepare(
      `SELECT id, string, COUNT(post_id) AS post_count
        FROM tags
        JOIN post_tags ON tags.id=post_tags.tag_id
        GROUP BY string
        ORDER BY post_count DESC, string`,
    ).all();
    return {
      props: {
        tags,
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

const TagsPage: NextPage<PageProps> = ({ tags }) => {
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
    </>
  );
};

export default TagsPage;
