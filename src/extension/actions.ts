import { browser } from "webextension-polyfill-ts";

export type BackgroundAction =
  | "PopupMounted"
  | "MountToolBar"
  | "IngestWindow"
  | "IngestTab";

export type ContentScriptAction = "getScrollDepth";

// This is how you change the state of the app
export const sendAction = (action: BackgroundAction) =>
  browser.runtime.sendMessage(action);

// This is how the app talks to content scripts, usually for the purpose of getting information off the page
export const sendTabAction = (tabId: number, action: ContentScriptAction) =>
  browser.tabs.sendMessage(tabId, action);
