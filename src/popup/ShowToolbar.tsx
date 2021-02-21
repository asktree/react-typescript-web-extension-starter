import { sendAction } from "@src/extension/actions";
import { log } from "@src/util";
import React, { FC } from "react";
import { browser } from "webextension-polyfill-ts";

const ShowToolbar: FC = () => {
  const a = 1;
  return (
    <button onClick={() => sendAction("MountToolBar")}>show toolbar</button>
  );
};

export default ShowToolbar;
