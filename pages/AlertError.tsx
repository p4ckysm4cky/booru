import { PropsWithChildren } from "react";

export const AlertError = ({ children }: PropsWithChildren) => {
  return (
    <div style={{ margin: "1rem" }}>
      <div
        style={{
          // Styling.
          padding: "1.5rem",
          maxWidth: "48rem",
          borderWidth: "1px",
          borderRadius: "0.5rem",
          margin: "2rem auto",
          // Alert colors taken from Bootstrap.
          color: "#856404",
          borderColor: "#ffeeba",
          backgroundColor: "#fff3cd",
        }}
      >
        {children}
      </div>
    </div>
  );
};
