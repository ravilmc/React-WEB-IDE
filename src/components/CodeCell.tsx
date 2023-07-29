import { bundle } from "@/bundler";
import { useEffect, useState } from "react";
import { CodeEditor } from "./codeEditor";
import { Preview } from "./preview";
import { Resizable } from "./Resizable";
export const CodeCell = () => {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output.code);
      setErr(output.error);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor onChange={(v) => setInput(v)} initialValue="" />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};
