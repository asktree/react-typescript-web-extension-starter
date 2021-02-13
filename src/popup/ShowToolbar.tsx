import Message from "@src/extension/message";
import { log } from "@src/util";
import React, { FC } from "react";
import { browser } from "webextension-polyfill-ts";

const ShowToolbar: FC = () => {
  const a = 1;
  return (
    <button onClick={() => browser.runtime.sendMessage(Message.mountToolbar)}>
      show toolbar
    </button>
  );
};

export default ShowToolbar;
