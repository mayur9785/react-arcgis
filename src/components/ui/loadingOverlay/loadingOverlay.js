import React from "react";

export default function LoadingOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100%",
        background: "#3b3b3b80",
      }}
    >
      <h1
        style={{
          color: "#d00205CC",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Loading ...
      </h1>
    </div>
  );
}
