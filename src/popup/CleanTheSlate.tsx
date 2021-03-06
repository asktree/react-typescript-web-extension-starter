import React, { FC } from "react";
import { browser } from "webextension-polyfill-ts";
import { BackgroundAction } from "@src/extension/actions";

const CleanTheSlate: FC = () => {
  const a = 1;
  return (
    <>
      <button
        onClick={async () => {
          BackgroundAction.send("IngestActiveTab");
        }}
      >
        Ingest this tab
      </button>
      <button
        onClick={async () => {
          BackgroundAction.send("IngestAllTabs");
        }}
      >
        Ingest each tab
      </button>
      <button
        onClick={async () => {
          BackgroundAction.send("IngestWindow");
        }}
      >
        Ingest window
      </button>
    </>
  );
};

export default CleanTheSlate;
