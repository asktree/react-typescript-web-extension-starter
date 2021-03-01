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

export const promiseMap = <P extends any, T extends any>(
  f: (x: P) => T
) => async (x: Promise<P>) => f(await x);
