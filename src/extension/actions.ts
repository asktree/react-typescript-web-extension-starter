import { TabSnapshot } from "@src/data/client";
import { browser } from "webextension-polyfill-ts";
import * as T from "fp-ts/Task";

export type BackgroundAction =
  | "PopupMounted"
  | "MountToolBar"
  | "IngestWindow"
  | "IngestTab";

// This is how you change the state of the app
export const sendAction = (action: BackgroundAction) =>
  browser.runtime.sendMessage(action);

export namespace TabAction {
  export type Message = "GetScrollDepth" | "GetHello";

  type Action<msg extends Message, result extends any | void> = {
    send: (tabId: number, msg: msg) => T.Task<Promise<result>>;
    listen: (msg: msg) => Promise<result>;
  };

  type actions = Action<"GetScrollDepth", Pick<TabSnapshot, "scrollPosition">> &
    Action<"GetHello", "hello">;

  export const send: actions["send"] = (
    tabId: number,
    msg: TabAction.Message
  ) => T.of(browser.tabs.sendMessage(tabId, msg));

  // TS doesnt let me
  // export type Listen = actions["listen"];
}
