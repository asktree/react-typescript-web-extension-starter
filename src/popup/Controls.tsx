import { BackgroundAction } from "@src/extension/actions";
import React, { FC } from "react";
import { browser } from "webextension-polyfill-ts";

const Controls: FC = () => {
  const a = 1;
  return (
    <button onClick={() => BackgroundAction.send("OpenNextItem")}>
      Open Next
    </button>
  );
};

export default Controls;
