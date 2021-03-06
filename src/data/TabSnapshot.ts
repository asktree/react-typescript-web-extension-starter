import { Tabs, browser } from "webextension-polyfill-ts";
import { pipe, flow } from "fp-ts/function";
import * as A from "fp-ts/Array";
import { TabAction } from "@src/extension/actions";
import { Pwomise } from "@src/util";

namespace TabSnapshot {
  export type t = Tabs.Tab & {
    scrollPosition: [vertical: number, horizontal: number];
    //sessionId: string;
  };

  /** convert a Tab to a TabSnapshot */
  export const fromTab = async (tab: Tabs.Tab) => {
    if (tab.id === undefined) throw "tab has no id";
    const info = await TabAction.send(tab.id, "GetScrollDepth");
    const tabSnapshot: t = {
      ...tab,
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

  export const restore = async (tab: t) => {
    browser.sessions.restore(tab.sessionId);
    // todo: restore scrollPos
  };
}

export default TabSnapshot;
