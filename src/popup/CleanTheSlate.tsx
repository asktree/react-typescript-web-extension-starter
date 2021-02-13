import React, { FC } from "react";
import { browser } from "webextension-polyfill-ts";

const CleanTheSlate: FC = () => {
    const a = 1;
    return (
        <button
            onClick={async () =>
                console.log(await browser.tabs.query({ currentWindow: true }))
            }
        >
            CLEAN
        </button>
    );
};

export default CleanTheSlate;
