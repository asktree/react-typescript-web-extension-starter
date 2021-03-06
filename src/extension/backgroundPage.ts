import { browser, Tabs } from "webextension-polyfill-ts";
import { BackgroundAction, TabAction } from "./actions";
import { UserData } from "@src/data/client";
import TabSnapshot from "@src/data/TabSnapshot";
import { handle, log, mapRight } from "@src/util";
import * as T from "fp-ts/Task";
import { flow, identity, pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/Array";

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener(async (msg: BackgroundAction.Message) => {
  console.log(`recieved msg: ${msg}`);
  switch (msg) {
    case "PopupMounted":
      console.log("backgroundPage notified that Popup.tsx has mounted.");
      return;

    case "MountToolBar":
      console.log("mounting toolbar...");
      browser.tabs.executeScript({
        file: "js/toolbar.js",
      });
      return;

    case "IngestAllTabs":
      return await pipe(
        await TabSnapshot.query({ currentWindow: true }),
        A.map((x) => UserData.createItem([x])),
        Promise.all
      );

    case "IngestActiveTab":
      return await pipe(
        await TabSnapshot.query({ currentWindow: true, active: true }),
        log("ingesting active tab"),
        UserData.createItem
      );

    case "IngestWindow":
      return await pipe(
        await TabSnapshot.query({ currentWindow: true }),
        UserData.createItem
      );
  }
});
const aaa = mapRight(UserData.createItem);
