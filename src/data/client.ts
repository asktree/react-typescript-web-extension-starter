import { browser } from "webextension-polyfill-ts";
import { uid } from "uid";
import { add } from "date-fns";
import { Pwomise, Wecord } from "@src/util";
import { flow, pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as R from "remeda";
import TabSnapshot from "./TabSnapshot";
import { log } from "@src/util";

export type SchedulerInstructions =
  | {
      showBy: Date;
    }
  | "none";

export type History = [Date, any][];

export namespace Item {
  export type t = {
    id: string;
    tabs: TabSnapshot.t[];
    createdAt: Date;
    lastSeen: Date;
    history: History;
    schedulerInstructions: SchedulerInstructions;
  };
  export const make = (tabs: TabSnapshot.t[]): t => ({
    id: uid(),
    tabs,
    createdAt: new Date(),
    lastSeen: new Date(),
    history: [],
    schedulerInstructions: "none",
  });

  export const restore = flow(
    (x: t) => x.tabs,
    A.map(TabSnapshot.restore),
    Pwomise.all
  );
}

export namespace UserData {
  export type t = Record<string, Item.t>;
  export const get = () => browser.storage.sync.get() as Promise<t>;
  export const put = (item: Item.t) =>
    browser.storage.sync.set({ [item.id]: item });

  export const createItem = flow(Item.make, log("storing item"), put);
}
export namespace Planner {
  export type t = { focused: Item.t | "nothing" };
  declare const dismiss: () => 1;
  // focus a tab:
  //chrome.tabs.update(this.id, { active: true }, callback);

  export const make = (): t => ({ focused: "nothing" });
  export namespace Data {
    export const peekNext = async (planner: t): Promise<Item.t> => {
      const allItems = pipe(
        await UserData.get(),
        R.toPairs,
        A.map(R.prop(1)),
        A.filter((x) => x.lastSeen !== undefined),
        R.sortBy(R.prop("lastSeen"))
      );
      return allItems[0];
    };
  }

  export namespace Interface {
    declare const done: () => {};
    declare const sleep: () => {};
  }
}
