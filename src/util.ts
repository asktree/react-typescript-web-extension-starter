import { right, left, Either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as R from "remeda";
import * as A from "fp-ts/Array";
import { browser } from "webextension-polyfill-ts";

export const bgLog = (...args: any[]) =>
  ((browser.extension.getBackgroundPage() as unknown) as {
    console: Console;
  }).console.log(...args);

/** pipeable console.log */
export const log = (note: string) => <T extends any>(x: T) => {
  console.log(note, x);
  return x;
};

export const handle = async <T extends unknown>(promise: Promise<T>) => {
  try {
    const data = await promise;
    return right(data);
  } catch (err) {
    return left(err);
  }
};

export const mapRight = <A extends any, B extends any>(f: (a: A) => B) => (
  x: Either<string, A>
) => (x._tag === "Left" ? x : right(f(x.right)));

export namespace Pwomise {
  export const map = <A extends any, B extends any>(f: (x: A) => B) => async (
    x: Promise<A>
  ): Promise<B> => f(await x);

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

  export const all = <T extends any>(x: readonly Promise<T>[]) =>
    Promise.all(x);
}

export namespace Wecord {
  export const values = <K extends string | number | symbol, V extends any>(
    record: Record<K, V>
  ) =>
    pipe(
      record,
      R.toPairs,
      A.map(([k, v]: [string, V]) => v)
    );
}
