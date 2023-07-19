import { useEffect, useRef, useState } from "react";
import { Root, createRoot } from "react-dom/client";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { CodeEditor } from "./components/codeEditor";

declare global {
  interface Window {
    rootobj: Root;
    esbuildInitialised: boolean;
  }
}

const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.onerror = function(event) {
            const root = document.getElementById('root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + event + '</div>';
          };

          window.addEventListener('message', (event) => {
            try {
              eval(event.data);

            }catch(err) {
              const root = document.getElementById('root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            }
          }, false);

        </script>
      </body>
    </html>
  `;

const App = () => {
  const [input, setInput] = useState("");

  const iframe = useRef<HTMLIFrameElement>(null);

  const [code, setCode] = useState("");

  const startService = async () => {
    if (!window.esbuildInitialised) {
      await esbuild.initialize({
        worker: true,
        wasmURL: "https://unpkg.com/esbuild-wasm@0.18.14/esbuild.wasm",
      });
      window.esbuildInitialised = true;
    }
  };

  const onClick = async () => {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        global: "window",
      },
    });

    if (iframe.current) {
      iframe.current.srcdoc = html;
    }

    iframe.current?.contentWindow?.postMessage(result.outputFiles[0].text, "*");
  };

  useEffect(() => {
    startService();
  }, []);

  return (
    <div>
      <CodeEditor initialValue="const a =1;" />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div>
        <button onClick={onClick}>Run</button>
      </div>

      <iframe ref={iframe} srcDoc={html} sandbox="allow-scripts" />
    </div>
  );
};

const container = document.getElementById("root");

if (!window.rootobj) {
  window.rootobj = createRoot(container!);
}

window.rootobj.render(<App />);
