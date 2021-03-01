import { browser } from "webextension-polyfill-ts";
import { BackgroundAction, TabAction } from "./actions";
import { TabSnapshot, UserData } from "@src/data/client";
import { handle } from "@src/util";

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener(async (action: BackgroundAction) => {
  switch (action) {
    case "PopupMounted":
      console.log("backgroundPage notified that Popup.tsx has mounted.");
      break;
    case "MountToolBar":
      console.log("mounting toolbar...");
      browser.tabs.executeScript({
        file: "js/toolbar.js",
      });

      break;
    case "IngestWindow": {
      // we have to relay this to all the tabs
      (await browser.tabs.query({ currentWindow: true })).map(async (tab) => {
        if (tab.id === undefined) {
          return;
        }

        const info = await TabAction.send(tab.id, "GetScrollDepth")();

        const tabSnapshot: TabSnapshot = { ...tab, ...info };
      });
    }
  }
});
