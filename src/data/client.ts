import { browser } from "webextension-polyfill-ts";
import { uid } from "uid";
import { add } from "date-fns";
import { handle, Pwomise } from "@src/util";
import { flow } from "fp-ts/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import TabSnapshot from "./TabSnapshot";
import { pipe } from "fp-ts/lib/pipeable";
import { invoke } from "cypress/types/lodash";

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
  export type t = {
    items: Record<string, Item.t>;
  };
  export const get = () => browser.storage.sync.get() as Promise<t>;
  export const set = (draft: t) => browser.storage.sync.set(draft);

  export const insertItem = async (item: Item.t) => {
    const draft = await get();
    draft.items[item.id] = item;
    await set(draft);
  };

  // same thing.. except with functional composition. isnt it beautiful...
  export const insertItem2 = async (item: Item.t) =>
    pipe(
      await get(),
      (x) => {
        x.items[item.id] = item;
        return x;
      },
      set
    );

  // same thing.. except with functional composition. isnt it beautiful...
  export const insertItem3 = (item: Item.t) =>
    pipe(
      get(),
      Pwomise.map((x) => {
        x.items[item.id] = item;
        return x;
      }),
      Pwomise.chain(set)
    );

  export const createItem = flow(Item.make, insertItem);
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
