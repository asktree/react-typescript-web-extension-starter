import { browser, Runtime } from "webextension-polyfill-ts";
import { TabAction } from "./actions";
import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import TabSnapshot from "@src/data/TabSnapshot";
import { absurd } from "fp-ts/lib/function";

const Page: FC = () => {
  const a = 1;
  return <div>hello</div>;
};

const app = document.createElement("div");
document.documentElement.prepend(app);
ReactDOM.render(<Page />, app);
