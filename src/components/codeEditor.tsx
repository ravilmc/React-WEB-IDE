import MonacoEditor, { Monaco, OnMount } from "@monaco-editor/react";
import React, { useCallback, useRef } from "react";
import parser from "prettier/parser-babel";
import "./codeEditor.css";
import { editor } from "monaco-editor";
import prettier from "prettier";
interface CodeEditorProps {
  onChange(value: string): void;
  initialValue: string;
}

const activateMonacoJSXHighlighter = async (
  monacoEditor: editor.IStandaloneCodeEditor,
  monaco: Monaco
) => {
  const { default: traverse } = await import("@babel/traverse");
  const { parse } = await import("@babel/parser");
  const { default: MonacoJSXHighlighter } = await import(
    // @ts-ignore
    "monaco-jsx-highlighter"
  );

  const monacoJSXHighlighter = new MonacoJSXHighlighter(
    monaco,
    parse,
    traverse,
    monacoEditor
  );

  monacoJSXHighlighter.highlightOnDidChangeModelContent(
    () => {
      console.log("changed");
    },
    () => {
      console.log("error");
    },
    undefined,
    () => {
      console.log("comment");
    }
  );
  monacoJSXHighlighter.addJSXCommentCommand();

  return {
    monacoJSXHighlighter,
  };
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue,
  onChange,
}) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const onFormatClick = () => {
    // get current value from editor

    if (editorRef.current) {
      const unformatted = editorRef.current.getValue();

      console.log(unformatted);

      const formatted = prettier.format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      });

      console.log(formatted);

      editorRef.current.setValue(formatted);
    }
  };

  const onEditorDidMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      onChange(value);
    });

    editor.getModel()?.updateOptions({ tabSize: 2 });
  }, []);

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        onMount={onEditorDidMount}
        value={initialValue}
        height="100% "
        language="javascript"
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
    </div>
  );
};
