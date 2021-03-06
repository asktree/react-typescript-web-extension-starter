import { Tabs, browser } from "webextension-polyfill-ts";
import { pipe, flow } from "fp-ts/function";
import * as A from "fp-ts/Array";
import { TabAction } from "@src/extension/actions";
import { Pwomise } from "@src/util";

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
  export const getCurrent2 = flow(
    browser.tabs.getCurrent, // returns Promise<Tabs.Tab>
    Pwomise.chain(TabSnapshot.fromTab) // fromTab is Tabs.Tab => Promise<TabSnapshot>
  );

  export const getCurrent = () =>
    browser.tabs.getCurrent().then(TabSnapshot.fromTab);

  const getAllTabsInWindow = () =>
    browser.tabs
      .query({ currentWindow: true })
      .then(A.filter((tab) => tab.id !== undefined));

  export const getAllInWindow2 = flow(
    getAllTabsInWindow,
    Pwomise.map(A.map(TabSnapshot.fromTab))
  );
  export const getAllInWindow = () =>
    getAllTabsInWindow().then(A.map(TabSnapshot.fromTab));

  export const restore = async (tab: t) => {
    browser.sessions.restore(tab.sessionId);
    // todo: restore scrollPos
  };
}

export default TabSnapshot;
