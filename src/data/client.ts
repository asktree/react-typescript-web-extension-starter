import { Tabs, browser } from "webextension-polyfill-ts";
import { uid } from "uid";
import { add } from "date-fns";
import { handle } from "@src/util";
import { flow } from "fp-ts/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";

export type SchedulerInstructions =
  | {
      showBy: Date;
    }
  | "none";

export type History = [Date, any][];

export interface TabSnapshot extends Tabs.Tab {
  scrollPosition: [vertical: number, horizontal: number];
}
export namespace Item {
  export type t = {
    id: string;
    tabs: TabSnapshot[];
    createdAt: Date;
    history: History;
    schedulerInstructions: SchedulerInstructions;
  };
  export const make = (tabs: TabSnapshot[]): t => ({
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
