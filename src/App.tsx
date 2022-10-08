import "./App.css";
import { Image } from "image-js";
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { curve } from "./helper/curve";
import { Histogram } from "./Histogram";
import { Graph } from "./Graph";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [histogram, setHistogram] = useState<number[]>();

  useEffect(() => {
    (async () => {
      const image = await Image.load(
        "https://picsum.photos/seed/picsum/800/550"
      );

      setCanvas(image.getCanvas());
      setHistogram(image.getHistogram({ channel: 0 }));
    })();
  }, []);

  if (canvasRef.current && canvas) {
    canvasRef.current?.replaceWith(canvas);
  }

  return (
    <div className="App">
      <div
        css={css`
          display: grid;
          grid-template-columns: auto auto;
          gap: 16px;
        `}
      >
        <canvas
          width={800}
          height={550}
          ref={canvasRef}
          css={css`
            background-color: black;
          `}
        />
        <Histogram values={histogram} />
        <Graph
          values={curve([
            { x: 0, y: 0 },
            { x: 0.25, y: 0.125 },
            { x: 0.5, y: 0.5 },
            { x: 0.75, y: 0.875 },
            { x: 1, y: 1 },
          ])}
        />
      </div>
    </div>
  );
};
