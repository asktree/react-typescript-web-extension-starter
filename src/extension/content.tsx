import { browser, Runtime } from "webextension-polyfill-ts";
import { TabAction } from "./actions";
import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TabSnapshot } from "@src/data/client";
import { absurd } from "fp-ts/lib/function";

const Content: FC = () => {
  const [x, setX] = useState(1);

  useEffect(() => {
    const listener = async (msg: TabAction.Message) => {
      switch (msg) {
        case "GetScrollDepth": {
          console.log("📨 collecting info on this tab!");
          return {
            scrollPosition: [
              document.documentElement.scrollHeight,
              document.documentElement.scrollWidth,
            ],
          };
        }
        case "GetHello": {
          console.log("hello");
          return "hello";
        }
        default:
          return absurd(msg);
      }
    };

    browser.runtime.onMessage.addListener(listener);
    // Clear our listener when this gets unmonted
    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  return <></>;
};

const app = document.createElement("div");
app.id = "imp-content";
document.documentElement.prepend(app);
ReactDOM.render(<Content />, app);
