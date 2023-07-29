import React, { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "./resizable.css";
interface ResizableProps {
  direction: "horizontal" | "vertical";
  children: React.ReactNode;
}

export const Resizable: React.FC<ResizableProps> = ({
  direction,
  children,
}) => {
  const [width, setWidth] = useState(window.innerWidth * 0.75);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  useEffect(() => {
    let timer: number;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);

        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  let resizableProps: ResizableBoxProps;

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      height: Infinity,
      width: width,
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth, Infinity],
      resizeHandles: ["e"],
      onResizeStop: (_, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      className: "resize-vertical",
      height: 300,
      width: Infinity,
      minConstraints: [Infinity, 24],
      maxConstraints: [Infinity, innerHeight * 0.9],
      resizeHandles: ["s"],
    };
  }
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};
