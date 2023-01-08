import { PostThumbnail } from "./PostThumbnail";
import { QueryResults, retrievePosts } from "../server/query";
import { PageNavigation } from "./PageNavigation";
import styles from "./index.module.scss";
import Head from "next/head";
import { serverProps, ServerProps } from "./_app.page";
import { NextPage } from "next";

const DEFAULT_POST_LIMIT = 20;

interface PageProps {
  search: string;
  results: QueryResults;
  page: number;
  limit: number;
}

export const getServerSideProps: ServerProps<PageProps> = serverProps(
  async ({ query }) => {
    const search = (query["search"] || "") as string;
    const page = parseInt((query["page"] || 1) as string);
    const limit = parseInt((query["limit"] || DEFAULT_POST_LIMIT) as string);
    const results = retrievePosts(search, page, limit);

    return {
      props: {
        search,
        results,
        page,
        limit,
      },
    };
  },
);

const HomePage: NextPage<PageProps> = ({ search, results, page, limit }) => {
  if (results.posts.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>No results found</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{search}</title>
      </Head>
      <div>
        <div className={styles.imageGallery}>
          {results.posts.map(({ id, thumbnailURL }) => (
            <PostThumbnail key={id} postID={id} thumbnailURL={thumbnailURL} />
          ))}
        </div>
        <PageNavigation
          page={page}
          pages={results.pages}
          params={{
            limit: limit.toString(),
            search,
          }}
        />
      </div>
    </>
  );
};

export default HomePage;
