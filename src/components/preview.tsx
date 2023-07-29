import React, { useEffect, useRef } from "react";
import "./preview.css";
interface PreviewProps {
  code: string;
  err: string;
}

const html = `
    <html>
      <head>
      <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.getElementById('root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          };

          
          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });
          

          window.addEventListener('message', (event) => {
              eval(event.data);
          }, false);

        </script>
      </body>
    </html>
  `;

export const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframe.current) {
      iframe.current.srcdoc = html;
      setTimeout(() => {
        iframe.current?.contentWindow?.postMessage(code, "*");
      }, 50);
      //
    }
  }, [code]);

  console.log(err);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
        title="preview"
      />

      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};
