import Link from "next/link";
import styles from "./PostThumbnail.module.scss";
import { PostGetResponse } from "./api/types";
import { useState } from "react";
import dayjs from "dayjs";

const PostSummary = ({ created_at, tags }: PostGetResponse) => {
  return (
    <div className={styles.postSummaryContainer}>
      <div className={styles.postSummary}>
        <div>
          <span style={{ padding: "5px 0px 0px 5px" }}>
            {dayjs().to(dayjs.utc(created_at))}
          </span>
        </div>
        <dl style={{ margin: 0, padding: 0 }}>
          {tags.map((tag) => (
            <dt key={tag.string} style={{ fontSize: "smaller" }}>
              <Link href={`/?search=${tag.string}`}>{tag.string}</Link>
            </dt>
          ))}
        </dl>
      </div>
    </div>
  );
};

export const PostThumbnail = ({
  postID,
  thumbnailURL,
}: {
  postID: number;
  thumbnailURL: string;
}) => {
  const [summary, setSummary] = useState<PostGetResponse | null>(null);
  return (
    <div
      className={styles.postThumbnail}
      onMouseEnter={async () => {
        if (!summary) {
          const data: PostGetResponse = await (
            await fetch(`/api/post/${postID}`)
          ).json();
          setSummary(data);
        }
      }}
    >
      <Link href={`/post/${postID}`} style={{ fontSize: 0 }}>
        <img src={thumbnailURL} alt={`${postID}`} />
      </Link>
      {summary && <PostSummary {...summary} />}
    </div>
  );
};
