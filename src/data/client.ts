/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
import { browser } from "webextension-polyfill-ts";
import { uid } from "uid";
import { add } from "date-fns";
import { Pwomise, Wecord } from "@src/util";
import { flow, pipe } from "fp-ts/function";
import * as R from "rambdax";
import TabSnapshot from "./TabSnapshot";
import { log } from "@src/util";

export type SchedulerInstructions =
  | {
      showBy: Date;
    }
  | "none";

export type History = [Date, any][];

export namespace Item {
  export type t = Readonly<{
    id: string;
    tabs: TabSnapshot.t[];
    createdAt: Date;
    lastSeen: Date;
    //history: History;
    //schedulerInstructions: SchedulerInstructions;
    done: boolean;
  }>;
  export const make = (tabs: TabSnapshot.t[]): t => ({
    id: uid(),
    tabs,
    createdAt: new Date(),
    lastSeen: new Date(),
    //history: [],
    //schedulerInstructions: "none",
    done: false,
  });

  export const restore = R.pipe(
    (x: t) => x.tabs,
    R.map(TabSnapshot.restore),
    Pwomise.all
  );
}

export namespace UserData {
  export type t = Record<string, Item.t>;
  export const get = () => browser.storage.sync.get() as Promise<t>;
  export const put = (item: Item.t) =>
    browser.storage.sync.set({ [item.id]: item });
  export const update = (item: Item.t) =>
    browser.storage.sync.set({ [item.id]: item });

  export const createItem = flow(Item.make, log("storing item"), put);
  export const recordItemSeen = flow(
    (x: Item.t) => ({ ...x, lastSeen: new Date() }),
    update
  );
  export const recordItemDone = flow(
    (x: Item.t) => ({ ...x, done: true }),
    update
  );
}
