import Dropzone from "react-dropzone";
import { CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { UploadResponse } from "./api/types";
import Head from "next/head";

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

interface ResultSuccess {
  type: "success";
  file: File;
  postID: number;
}

interface ResultFailed {
  type: "failed";
  file: File;
  error: string;
}

type UploadResult = ResultSuccess | ResultFailed;

export default function UploadPage() {
  const [inProgress, setInProgress] = useState<File | null>(null);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [results, setResults] = useState<UploadResult[]>([]);

  useEffect(() => {
    if (!inProgress && uploadQueue.length > 0) {
      (async () => {
        const addResult = (result: UploadResult) =>
          setResults([result, ...results]);

        // Remove next file.
        const file = uploadQueue.shift()!;
        setUploadQueue(uploadQueue);
        setInProgress(file);

        // Upload file.
        const rawResponse = await fetch("/api/upload", {
          method: "POST",
          body: file,
        });

        setInProgress(null);
        if (!rawResponse.ok) {
          const error =
            rawResponse.status == 413
              ? "Too large"
              : `Failed (${rawResponse.status})`;
          addResult({ type: "failed", file, error });
          return;
        }

        const response: UploadResponse = await rawResponse.json();
        addResult({ type: "success", file, ...response });
      })();
    }
  }, [inProgress, uploadQueue, results]);

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
              setUploadQueue([...uploadQueue, ...files]);
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
                    <td>{inProgress.name}</td>
                    <td>Uploading...</td>
                  </tr>
                )}
                {uploadQueue.map((file) => (
                  <tr key={null}>
                    <td>{file.name}</td>
                    <td>Pending</td>
                  </tr>
                ))}
                {results.map((result) => (
                  <tr key={null}>
                    <td>{result.file.name}</td>
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
}
