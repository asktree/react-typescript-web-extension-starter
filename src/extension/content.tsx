import { browser, Runtime } from "webextension-polyfill-ts";
import Message from "./message";
import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import message from "./message";

const Content: FC = () => {
  const [x, setX] = useState(1);

  useEffect(() => {
    const listener = async (request: typeof Message[keyof typeof Message]) => {
      switch (request.msg) {
        case "CleanTheSlate": {
          console.log("collecting info on this tab!");
          return {
            insert: { scrollDepth: 1 },
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
