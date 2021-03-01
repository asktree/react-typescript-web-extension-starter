import { Tabs, browser } from "webextension-polyfill-ts";
import { pipe, flow } from "fp-ts/function";
import * as A from "fp-ts/Array";
import { TabAction } from "@src/extension/actions";
import { promiseMap } from "@src/util";

namespace TabSnapshot {
  export type t = Tabs.Tab & {
    scrollPosition: [vertical: number, horizontal: number];
    sessionId: string;
  };

  /** convert a Tab to a TabSnapshot */
  export const fromTab = async (tab: Tabs.Tab) => {
    const info = await TabAction.send(tab.id as number, "GetScrollDepth");
    const tabSnapshot: t = { ...tab, sessionId: tab.sessionId!, ...info };
    return tabSnapshot;
  };

  /** get a TabSnapshot for the current tab */
  export const getCurrent = flow(
    browser.tabs.getCurrent,
    promiseMap(TabSnapshot.fromTab)
  );

  const getAllTabsInWindow = async () =>
    pipe(
      browser.tabs.query({ currentWindow: true }),
      promiseMap(A.filter((tab) => tab.id !== undefined))
    );

  export const getAllInWindow = flow(
    getAllTabsInWindow,
    promiseMap(A.map(TabSnapshot.fromTab))
  );

  export const restore = async (tab: t) => {
    browser.sessions.restore(tab.sessionId);
  };
}

export default TabSnapshot;
