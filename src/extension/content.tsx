import { browser, Runtime } from "webextension-polyfill-ts";
import { ContentScriptAction } from "./actions";
import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Content: FC = () => {
  const [x, setX] = useState(1);

  useEffect(() => {
    const listener = async (msg: ContentScriptAction) => {
      switch (msg) {
        case "getScrollDepth": {
          console.log("collecting info on this tab!");
          return {
            insert: {
              scrollHeight: document.documentElement.scrollHeight,
              scrollWidth: document.documentElement.scrollHeight,
            },
          };
        }
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);
  return <></>;
};

const app = document.createElement("div");
app.id = "imp-content";
document.documentElement.prepend(app);
ReactDOM.render(<Content />, app);
