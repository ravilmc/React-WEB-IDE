import React from "react";
import MDEditor from "@uiw/react-markdown-editor";

export const TextEditor: React.FC = () => {
  return (
    <div>
      <MDEditor.Markdown source="# Headerz" />
    </div>
  );
};
