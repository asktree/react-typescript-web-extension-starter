import React, { FunctionComponent } from "react";
import { Hello } from "./Hello";
import { browser } from "webextension-polyfill-ts";
import { Scroller } from "./Scroller";
import "./styles.scss";
import CleanTheSlate from "./CleanTheSlate";
import ShowToolbar from "./ShowToolbar";
import { sendAction } from "@src/extension/actions";

// // // //

export const Popup: FunctionComponent = () => {
  // Sends the `popupMounted` event
  React.useEffect(() => {
    sendAction("PopupMounted");
  }, []);

  // Renders the component tree
  return (
    <div className="popup-container">
      <div className="container mx-4 my-4">
        <Hello />
        <hr />
        <Scroller />
        <hr />
        <CleanTheSlate />
        <hr />
        <ShowToolbar />
      </div>
    </div>
  );
};