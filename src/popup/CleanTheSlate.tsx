import { log } from "@src/util";
import React, { FC } from "react";
import { browser } from "webextension-polyfill-ts";
import Message from "@src/extension/message";

const CleanTheSlate: FC = () => {
  const a = 1;
  return (
    <button
      onClick={async () => {
        browser.runtime.sendMessage(Message.cleanTheSlate);
      }}
    >
      CLEAN
    </button>
  );
};

export default CleanTheSlate;
