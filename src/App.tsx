import "./App.css";
import { Image } from "image-js";
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { Histogram } from "./Histogram";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [histogram, setHistogram] = useState<number[]>();
  const [image, setImage] = useState<Image>();

  useEffect(() => {
    (async () => {
      setImage(await Image.load("https://picsum.photos/seed/picsum/800/550"));
    })();
  }, []);

  useEffect(() => {
    if (canvasRef.current && image) {
      canvasRef.current?.replaceWith(image.getCanvas());
    }

    if (image) {
      setHistogram(image.getHistogram({ channel: 0 }));
    }
  }, [image]);

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
        <Histogram
          values={histogram}
          onChangeToneCurve={(points) => {
            console.log(points);
          }}
        />
      </div>
    </div>
  );
};
