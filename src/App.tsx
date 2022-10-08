import "./App.css";
import { Image } from "image-js";
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { Histogram } from "./Histogram";
import { convertImage } from "./helper/image";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [histogram, setHistogram] = useState<number[]>();
  const [image, setImage] = useState<Image>();
  const [originalImage, setOriginalImage] = useState<Image>();

  useEffect(() => {
    (async () => {
      const image = await Image.load(
        "https://picsum.photos/seed/picsum/800/550"
      );
      setOriginalImage(image);
      setImage(image);
      setHistogram(image.getHistogram({ channel: 0 }));
    })();
  }, []);

  useEffect(() => {
    if (image) {
      canvasRef.current?.getContext("2d")?.drawImage(image.getCanvas(), 0, 0);
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
            const newImage = image
              ? convertImage(
                  originalImage!,
                  (v) => points[Math.floor((v * 100) / 256)] * 256
                )
              : undefined;
            setImage(newImage);
          }}
        />
      </div>
    </div>
  );
};
