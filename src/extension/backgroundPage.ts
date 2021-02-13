import { browser } from "webextension-polyfill-ts";
import Message from "./message";

const handle = (promise: Promise<any>) => {
  return promise
    .then((data) => [data, undefined])
    .catch((error) => Promise.resolve([undefined, error]));
};

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener(
  async (request: typeof Message[keyof typeof Message]) => {
    switch (request.msg) {
      case "PopupMounted":
        console.log("backgroundPage notified that Popup.tsx has mounted.");
        break;
      case "MountToolbar":
        console.log("mounting toolbar...");
        browser.tabs.executeScript({
          file: "js/toolbar.js",
        });

        break;
      case "CleanTheSlate": {
        // we have to relay this to all the tabs
        (await browser.tabs.query({ currentWindow: true })).map(async (tab) => {
          if (tab.id === undefined) {
            return;
          }
          const [resp, respErr] = await handle(
            browser.tabs.sendMessage(tab.id, Message.cleanTheSlate)
          );
          if (respErr) throw new Error(JSON.stringify(respErr));

          console.log(resp);
          const prev = await browser.storage.sync.get();
          const town = prev.town;
          const next = {
            town: {
              residents: [...(town?.residents ?? []), { ...resp.insert, tab }],
            },
          };
          console.log(next);
          const [setTown, setTownErr] = await handle(
            browser.storage.sync.set(next)
          );
          console.log(setTown);
          if (setTownErr) throw new Error(JSON.stringify(setTownErr));
        });
      }
    }
  }
);
