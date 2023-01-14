import Dropzone from "react-dropzone";
import { CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { UploadResponse } from "./api/types";
import Head from "next/head";
import { ServerProps, serverProps } from "./_app.page";
import { NextPage } from "next";

const dropStyle: CSSProperties = {
  // Center content.
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // Border style.
  borderWidth: "0.2rem",
  borderColor: "azure",
  borderStyle: "dashed",
  // Container style.
  width: "100%",
  margin: "4rem auto",
};

interface Entry {
  key: string;
  file: File;
}

interface ResultSuccess {
  type: "success";
  entry: Entry;
  postID: number;
}

interface ResultFailed {
  type: "failed";
  entry: Entry;
  error: string;
}

type UploadResult = ResultSuccess | ResultFailed;

interface PageProps {}

export const getServerSideProps: ServerProps<PageProps> = serverProps(
  async () => {
    return {
      props: {},
    };
  },
);

const UploadPage: NextPage<PageProps> = () => {
  const [inProgress, setInProgress] = useState<Entry | null>(null);
  const [uploadQueue, setUploadQueue] = useState<Entry[]>([]);
  const [results, setResults] = useState<UploadResult[]>([]);

  useEffect(() => {
    if (!inProgress && uploadQueue.length > 0) {
      (async () => {
        const addResult = (result: UploadResult) =>
          setResults((results) => [result, ...results]);

        // Remove next file.
        const entry = uploadQueue.shift()!;
        setUploadQueue(uploadQueue);
        setInProgress(entry);

        // Upload file.
        const rawResponse = await fetch("/api/upload", {
          method: "POST",
          body: entry.file,
        });

        setInProgress(null);
        if (!rawResponse.ok) {
          let error = `Failed (${rawResponse.status})`;
          if (rawResponse.status == 413) {
            error = "Too large";
          } else if (rawResponse.status == 409) {
            const response: UploadResponse = await rawResponse.json();
            error = `Duplicate of post ${response.postID}`;
          }
          addResult({ type: "failed", entry, error });
          return;
        }

        const response: UploadResponse = await rawResponse.json();
        addResult({ type: "success", entry, ...response });
      })();
    }
  }, [inProgress, uploadQueue]);

  return (
    <>
      <Head>
        <title>Upload</title>
      </Head>
      <div style={{ textAlign: "center", margin: "auto", maxWidth: "64rem" }}>
        <div>
          <h2>Upload</h2>
          <Dropzone
            onDropAccepted={(files, _event) => {
              setUploadQueue([
                ...uploadQueue,
                ...files.map((file) => ({
                  key: crypto.randomUUID(),
                  file,
                })),
              ]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ style: dropStyle })}>
                <input {...getInputProps()} />
                <div style={{ padding: "8rem" }}>Select or drag files here</div>
              </div>
            )}
          </Dropzone>
        </div>
        <div>
          <h2>Files</h2>
          {!inProgress && uploadQueue.length == 0 && results.length == 0 ? (
            <p>Uploaded files will appear here</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th style={{ width: "16rem" }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ wordBreak: "break-word" }}>
                {inProgress && (
                  <tr>
                    <td>{inProgress.file.name}</td>
                    <td>Uploading...</td>
                  </tr>
                )}
                {uploadQueue.map((entry) => (
                  <tr key={entry.key}>
                    <td>{entry.file.name}</td>
                    <td>Pending</td>
                  </tr>
                ))}
                {results.map((result) => (
                  <tr key={result.entry.key}>
                    <td>{result.entry.file.name}</td>
                    <td>
                      {result.type == "success" ? (
                        <Link target={"_blank"} href={`/post/${result.postID}`}>
                          ID: {result.postID}
                        </Link>
                      ) : (
                        <span style={{ color: "red" }}>{result.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadPage;
