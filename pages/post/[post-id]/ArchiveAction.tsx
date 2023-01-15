import { useState } from "react";
import { useRouter } from "next/router";

export const ArchiveAction = ({ postID }: { postID: number }) => {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  if (!clicked) {
    return (
      <a href={"#"} onClick={() => setClicked(true)}>
        Archive post
      </a>
    );
  }

  return (
    <div>
      <p style={{ marginBottom: "1rem" }}>
        <button
          onClick={async () => {
            await fetch(`/api/post/${postID}`, { method: "DELETE" });
            await router.push("/");
          }}
        >
          Confirm archival?
        </button>
      </p>
      <p>This will hide the post but not delete the image from disk.</p>
    </div>
  );
};
