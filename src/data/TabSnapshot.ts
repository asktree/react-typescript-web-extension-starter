import { Tabs, browser } from "webextension-polyfill-ts";
import { pipe, flow } from "fp-ts/function";
import * as A from "fp-ts/Array";
import { TabAction } from "@src/extension/actions";
import { Pwomise } from "@src/util";

namespace TabSnapshot {
  export type t = Pick<
    Tabs.Tab,
    "favIconUrl" | "title" | "url" | "pinned" | "mutedInfo" | "lastAccessed"
  > & {
    title: string;
    url: string;
    scrollPosition: [vertical: number, horizontal: number];
    //sessionId: string;
  };

  /** convert a Tab to a TabSnapshot */
  export const fromTab = async (tab: Tabs.Tab) => {
    if (tab.id === undefined) throw "tab has no id";
    if (tab.title === undefined) throw "tab has no title";
    if (tab.url === undefined) throw "tab has no url";
    const info = await TabAction.send(tab.id, "GetScrollDepth");
    const tabSnapshot: t = {
      favIconUrl: tab.favIconUrl,
      mutedInfo: tab.mutedInfo,
      title: tab.title,
      url: tab.url,
      pinned: tab.pinned,
      lastAccessed: tab.lastAccessed,
      //sessionId: tab.sessionId,
      ...info,
    };
    return tabSnapshot;
  };

  export const query = async (options: Tabs.QueryQueryInfoType) =>
    pipe(
      await browser.tabs.query(options),
      A.filter((tab) => tab.id !== undefined),
      A.map(TabSnapshot.fromTab),
      Pwomise.all
    );

  export const restore = async (snapshot: t) => {
    browser.tabs.create(snapshot);
    // todo: restore scrollPos
  };
}

export default TabSnapshot;
