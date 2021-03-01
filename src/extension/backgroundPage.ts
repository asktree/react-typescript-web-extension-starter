import { browser, Tabs } from "webextension-polyfill-ts";
import { BackgroundAction, TabAction } from "./actions";
import { TabSnapshot, UserData } from "@src/data/client";
import { handle } from "@src/util";
import * as T from "fp-ts/Task";
import { flow, pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener(async (msg: BackgroundAction.Message) => {
  console.log(`recieved msg: ${msg}`);
  switch (msg) {
    case "PopupMounted": {
      console.log("backgroundPage notified that Popup.tsx has mounted.");
    }
    case "MountToolBar": {
      console.log("mounting toolbar...");
      browser.tabs.executeScript({
        file: "js/toolbar.js",
      });
    }
    case "IngestAllTabs": {
      const tabSnapshots = await TabSnapshot.getAllInWindow();
      const promises = tabSnapshots.map(async (tabSnapshot) =>
        UserData.createItem([await tabSnapshot])
      );
      await Promise.all(promises);
    }
    case "IngestActiveTab": {
      await pipe(await TabSnapshot.getCurrent(), A.of, UserData.createItem);
    }
    case "IngestWindow": {
      // wow this is truly incredible code.
      await pipe(
        await Promise.all(await TabSnapshot.getAllInWindow()),
        UserData.createItem
      );
    }
  }
});
