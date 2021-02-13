import { browser } from "webextension-polyfill-ts";

export const log = (...args: any[]) => (browser.extension.getBackgroundPage() as unknown as {console: Console}).console.log(...args);