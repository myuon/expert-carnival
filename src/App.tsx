import "./App.css";
import { Image } from "image-js";
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { Histogram } from "./Histogram";

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
      </div>
    </div>
  );
};
