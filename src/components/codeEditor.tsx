import MonacoEditor, { OnMount } from "@monaco-editor/react";
import React from "react";

interface CodeEditorProps {
  onChange(value: string): void;
  initialValue: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue , onChange }) => {
  const onEditorDidMount: OnMount = (editor) => {

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      onChange(value);
    });

    editor.getModel()?.updateOptions({ tabSize: 2 });

    // This is to fix the issue of the editor not showing the correct value
    // when the editor is first rendered
    editor.setValue(initialValue);
  };

  return (
    <MonacoEditor
      onMount={onEditorDidMount}
      value={initialValue}
      height="500px"
      language="typescript"
      theme="vs-dark"
      options={{
        wordWrap: "on",
        minimap: { enabled: false },
        showUnused: false,
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};
