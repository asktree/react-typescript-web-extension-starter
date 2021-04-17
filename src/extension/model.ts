import { Item, UserData } from "@src/data/client";
import { flow, pipe } from "fp-ts/function";
import * as R from "rambdax";

export namespace App {
  export type t = { focused: Item.t | undefined; history: Item.t[] };
  // focus a tab:
  //chrome.tabs.update(this.id, { active: true }, callback);

  export const unit = (): t => ({ focused: undefined, history: [] });
  let app: t | undefined = undefined;
  export const init = async (): Promise<t> => (app = await focusNext(unit())());

  export const get = async () => app ?? (await init());

  const peekNext = (state: t) => async (): Promise<Item.t> => {
    return pipe(
      await UserData.get(),
      R.toPairs,
      R.map((x) => x[1]),
      R.filter((x) => x.lastSeen !== undefined && x.id !== state.focused?.id),
      R.sortBy((x) => x.lastSeen),
      (x) => x[0]
    );
  };

  const focus = (state: t) => (item: Item.t) => ({
    ...state,
    focused: item,
  });
  const focusNext = (state: t) => async () => {
    const next = await peekNext(state)();
    // await UserData.recordItemSeen(next)
    return focus(state)(next);
  };

  export const done = (state: t) => async () => {
    if (state.focused === undefined) throw "illegal";
    await UserData.update({
      ...state.focused,
      lastSeen: new Date(),
      done: true,
    });
    return await focusNext(state)();
  };
  export const snooze = (state: t) => async () => {
    if (state.focused === undefined) throw "illegal";
    await UserData.update({
      ...state.focused,
      lastSeen: new Date(),
    });
    return await focusNext(state)();
  };
}
