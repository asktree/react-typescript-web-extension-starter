import React, { FunctionComponent } from "react";
import { Hello } from "./Hello";
import { browser } from "webextension-polyfill-ts";
import { Scroller } from "./Scroller";
import "./styles.scss";
import CleanTheSlate from "./CleanTheSlate";
import ShowToolbar from "./ShowToolbar";
import { BackgroundAction } from "@src/extension/actions";
import Controls from "./Controls";

// // // //

export const Popup: FunctionComponent = () => {
  // Sends the `popupMounted` event
  React.useEffect(() => {
    BackgroundAction.send("PopupMounted");
  }, []);

  // Renders the component tree
  return (
    <div className="popup-container">
      <div className="container mx-4 my-4">
        <Hello />
        <hr />
        <CleanTheSlate />
        <hr />
        <Controls />
      </div>
    </div>
  );
};
