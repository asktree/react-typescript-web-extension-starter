import { browser } from "webextension-polyfill-ts";
import { uid } from "uid";
import { add } from "date-fns";
import { Pwomise } from "@src/util";
import { flow } from "fp-ts/function";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
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
  declare type t = { focused: Item.t };
  declare const dismiss: () => 1;

  export namespace Data {
    declare const peekNext: (planner: t) => Item.t;
  }

  export namespace Interface {
    declare const done: () => {};
    declare const sleep: () => {};
  }
}
