import Link from "next/link";
import styles from "./PostThumbnail.module.scss";

export const PostThumbnail = ({
  postID,
  thumbnailURL,
}: {
  postID: number;
  thumbnailURL: string;
}) => {
  return (
    <div className={styles.postThumbnail}>
      <Link href={`/post/${postID}`} style={{ fontSize: 0 }}>
        <img src={thumbnailURL} alt={`${postID}`} />
      </Link>
    </div>
  );
};
