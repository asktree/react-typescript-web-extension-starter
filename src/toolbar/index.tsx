/* src/content.js */
import React from "react";
import ReactDOM from "react-dom";

class Main extends React.Component {
  render() {
    console.log("AA");
    return (
      <div className={"my-extension"}>
        <h1>Hello world - My fewst Extension</h1>
      </div>
    );
  }
}

const app = document.createElement("div");
app.id = "my-extension-root";
document.documentElement.prepend(app);
ReactDOM.render(<Main />, app);
