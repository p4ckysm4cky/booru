import Link from "next/link";
import styles from "./index.page.module.scss";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Authenticated } from "../../_app.page";
import {
  TagSearchContainer,
  TagSearchInputProps,
  TagSearchMenu,
} from "../../header/TagSearchMenu";

export interface Tag {
  id: number;
  string: string;
  post_count: number;
}

interface EditTag {
  string: string;
  keep: boolean;
}

const TagItem = ({ tag }: { tag: Tag }) => {
  return (
    <dt>
      <Link className={styles.tagItemLink} href={`/?search=${tag.string}`}>
        {tag.string} - {tag.post_count}
      </Link>
    </dt>
  );
};

const TagItemEdit = ({
  tag,
  setKeep,
}: {
  tag: EditTag;
  setKeep: (keep: boolean) => void;
}) => {
  return (
    <dt>
      <label style={{ margin: 0, fontWeight: "inherit" }}>
        <input
          type={"checkbox"}
          checked={tag.keep}
          style={{ margin: "0 1rem 0 0" }}
          onChange={(e) => setKeep(e.target.checked)}
        />
        {tag.string}
      </label>
    </dt>
  );
};

const AddTag = ({ addTag }: { addTag: (tag: string) => void }) => {
  const [tag, setTag] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addTag(tag);
        setTag("");
      }}
    >
      <h3>Add tag</h3>
      <div style={{ marginBottom: "1.5rem" }}>
        <TagSearchContainer>
          <input
            ref={inputRef}
            style={{ margin: 0 }}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            {...TagSearchInputProps}
          />
          <TagSearchMenu
            prefix={tag}
            onSelect={(string) => {
              // Refocus after selection outside input box.
              inputRef.current!.focus();
              setTag(string);
            }}
          />
        </TagSearchContainer>
      </div>
      <button type={"submit"}>Add</button>
    </form>
  );
};

export const TagsList = ({
  postID,
  tags,
  canSuggestTags,
}: {
  postID: number;
  tags: Tag[];
  canSuggestTags: boolean;
}) => {
  // Invariant: Edit tags are never removed.
  const router = useRouter();
  const [editTags, setEditTags] = useState<EditTag[] | null>(null);

  const saveNewTags = async (editTags: EditTag[]) => {
    const tagList = editTags.filter((tag) => tag.keep).map((tag) => tag.string);
    const response = await fetch(`/api/post/${postID}/tags`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tagList),
    });

    // Show error messages.
    if (!response.ok) {
      alert(await response.text());
    }
  };

  return (
    <div>
      <div>
        <h3 style={{ marginTop: 0, display: "inline-block" }}>Tags</h3>
        <Authenticated.Consumer>
          {(authenticated) =>
            authenticated &&
            editTags === null && (
              <a
                href={"#"}
                style={{ marginLeft: "1rem" }}
                onClick={() => {
                  setEditTags(tags.map((tag) => ({ ...tag, keep: true })));
                }}
              >
                Edit
              </a>
            )
          }
        </Authenticated.Consumer>
      </div>
      <dl style={{ marginTop: 0, overflowWrap: "anywhere" }}>
        {editTags === null
          ? tags.map((tag) => <TagItem key={tag.id} tag={tag} />)
          : editTags.map((tag, index) => (
              <TagItemEdit
                key={index}
                tag={tag}
                setKeep={(keep) => {
                  const editTagsCopy = [...editTags];
                  editTagsCopy[index] = { ...editTagsCopy[index], keep };
                  setEditTags(editTagsCopy);
                }}
              />
            ))}
      </dl>
      {editTags !== null && (
        <>
          <div>
            <button
              onClick={async () => {
                await saveNewTags(editTags);
                setEditTags(null);
                router.reload();
              }}
            >
              Save
            </button>
            {canSuggestTags && (
              <button
                style={{ marginLeft: "1rem" }}
                onClick={async () => {
                  const results: { tag: string }[] = await (
                    await fetch(`/api/post/${postID}/tags/suggest`)
                  ).json();

                  const tagExists = (string: string) => {
                    return editTags.some((edit) => edit.string === string);
                  };

                  setEditTags([
                    ...editTags,
                    ...results
                      .filter(({ tag }) => !tagExists(tag))
                      .map((result) => ({
                        string: result.tag,
                        keep: false,
                      })),
                  ]);
                }}
              >
                Suggest
              </button>
            )}
          </div>
          <AddTag
            addTag={(string) => {
              const tag = { string, keep: true };
              setEditTags([...editTags, tag]);
            }}
          />
        </>
      )}
    </div>
  );
};
