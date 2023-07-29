import "bulmaswatch/superhero/bulmaswatch.min.css";

import { Root, createRoot } from "react-dom/client";
import { App } from "./App";
declare global {
  interface Window {
    rootobj: Root;
    esbuildInitialised: boolean;
  }
}

const container = document.getElementById("root");

if (!window.rootobj) {
  window.rootobj = createRoot(container!);
}

window.rootobj.render(<App />);
