import { Tabs, browser } from "webextension-polyfill-ts";
import { uid } from "uid";
import { add } from "date-fns";
import { handle } from "@src/util";
import { flow, pipe } from "fp-ts/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as A from "fp-ts/Array";
import { TabAction } from "@src/extension/actions";

export type SchedulerInstructions =
  | {
      showBy: Date;
    }
  | "none";

export type History = [Date, any][];

export namespace TabSnapshot {
  export type t = Tabs.Tab & {
    scrollPosition: [vertical: number, horizontal: number];
  };

  export const fromTab = async (tab: Tabs.Tab) => {
    const info = await TabAction.send(tab.id as number, "GetScrollDepth");
    const tabSnapshot: t = { ...tab, ...info };
    return tabSnapshot;
  };

  export const getCurrent = async () =>
    pipe(await browser.tabs.getCurrent(), TabSnapshot.fromTab);

  const getAllTabsInWindow = async () =>
    (await browser.tabs.query({ currentWindow: true })).filter(
      (tab) => tab.id !== undefined
    );

  export const getAllInWindow = async () =>
    pipe(await getAllTabsInWindow(), A.map(TabSnapshot.fromTab));
}

export namespace Item {
  export type t = {
    id: string;
    tabs: TabSnapshot.t[];
    createdAt: Date;
    history: History;
    schedulerInstructions: SchedulerInstructions;
  };
  export const make = (tabs: TabSnapshot.t[]): t => ({
    id: uid(),
    tabs,
    createdAt: new Date(),
    history: [],
    schedulerInstructions: "none",
  });
}

export namespace UserData {
  export type t = {
    items: Record<string, Item.t>;
  };
  export const get = () => T.of(browser.storage.sync.get() as Promise<t>);
  export const set = (draft: t) => T.of(browser.storage.sync.set(draft));

  export const insertItem = async (item: Item.t) => {
    const draft = await get()();
    draft.items[item.id] = item;
    await set(draft)();
  };

  export const createItem = flow(Item.make, insertItem);
}
