import { browser } from "webextension-polyfill-ts";

export const log = (...args: any[]) =>
  ((browser.extension.getBackgroundPage() as unknown) as {
    console: Console;
  }).console.log(...args);

export const handle = <T extends unknown>(promise: Promise<T>) => {
  return promise
    .then((data) => [data, undefined] as const)
    .catch((error) => Promise.resolve([undefined, error] as const));
};
export namespace Pwomise {
  export const map = <P extends any, T extends any>(f: (x: P) => T) => async (
    x: Promise<P>
  ) => f(await x);

  export const chain = <P extends any, T extends any>(
    f: (x: P) => Promise<T>
  ) => async (x: Promise<P>) => await f(await x);
  // wait this breaks TS lol
  // type nestedPromise<T> = Promise<T> | Promise<nestedPromise<T>>;
  //type honk = nestedPromise<number>;

  type nestedPromise<T> =
    | Promise<T>
    | Promise<Promise<T>>
    | Promise<Promise<Promise<T>>>
    | Promise<Promise<Promise<Promise<T>>>>;

  export const flatten = async <T extends any>(
    x: nestedPromise<T>
  ): Promise<T> => await x;

  export const all = <T extends any>(x: Promise<T>[]) => Promise.all(x);
}
