import "./App.css";
import { Image } from "image-js";
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { Histogram } from "./Histogram";
import { convertImage } from "./helper/image";

const useFetchImage = (url: string) => {
  const [image, setImage] = useState<Image>();
  useEffect(() => {
    (async () => {
      const image = await Image.load(url);
      setImage(image);
    })();
  }, [url]);

  return { image, histogram: image?.getHistogram({ channel: 0 }) };
};

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<Image>();
  const { image: originalImage, histogram } = useFetchImage(
    "https://picsum.photos/seed/picsum/800/550"
  );

  useEffect(() => {
    if (originalImage) {
      setImage(originalImage);
    }
  }, [originalImage]);

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
            if (originalImage) {
              const newImage = image
                ? convertImage(
                    originalImage,
                    (v) => points[Math.floor((v * 100) / 256)] * 256
                  )
                : undefined;
              setImage(newImage);
            }
          }}
        />
      </div>
    </div>
  );
};
