import { log } from "@src/util";
import React, { FC } from "react";
import { browser } from "webextension-polyfill-ts";
import { sendAction } from "@src/extension/actions";

const CleanTheSlate: FC = () => {
  const a = 1;
  return (
    <>
      <button
        onClick={async () => {
          sendAction("IngestTab");
        }}
      >
        Ingest this tab
      </button>
      <button
        onClick={async () => {
          sendAction("IngestWindow");
        }}
      >
        Ingest all tabs
      </button>
    </>
  );
};

export default CleanTheSlate;
