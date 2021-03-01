import TabSnapshot from "@src/data/TabSnapshot";
import { browser } from "webextension-polyfill-ts";
import * as T from "fp-ts/Task";

export namespace BackgroundAction {
  export type Message =
    | "PopupMounted"
    | "MountToolBar"
    | "IngestWindow"
    | "IngestActiveTab"
    | "IngestAllTabs";

  // This is how you change the state of the app
  export const send = (msg: Message) => browser.runtime.sendMessage(msg);
}

export namespace TabAction {
  export type Message = "GetScrollDepth" | "GetHello";

  type Action<msg extends Message, result extends any | void> = {
    send: (tabId: number, msg: msg) => Promise<result>;
    listen: (msg: msg) => Promise<result>;
  };

  type actions = Action<
    "GetScrollDepth",
    Pick<TabSnapshot.t, "scrollPosition">
  > &
    Action<"GetHello", "hello">;

  export const send: actions["send"] = browser.tabs.sendMessage;

  // TS doesnt let me
  // export type Listen = actions["listen"];
}
