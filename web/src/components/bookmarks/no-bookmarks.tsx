import React from "react";

const NoBookmarks = () => {
  return (
    <div className="text-center w-full max-w-md">
      <svg
        className="mx-auto h-12 w-12 text-muted-foreground/40"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 11.186 0Z"
        />
      </svg>

      <h2 className="mt-4 text-lg font-semibold">No bookmarks yet</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Your saved bookmarks will appear here
      </p>
    </div>
  );
};

export default NoBookmarks;
