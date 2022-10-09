import "./App.css";
import { Image } from "image-js";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const { image: originalImage, histogram } = useFetchImage(
    "https://picsum.photos/seed/picsum/800/550"
  );

  const [toneCurve, setToneCurve] = useState<number[]>([]);
  const [rotation, setRotation] = useState(0);

  const update = useCallback(() => {
    if (!originalImage) {
      return;
    }

    const newImage = convertImage(
      originalImage,
      (v) => toneCurve[Math.floor((v * 100) / 256)] * 256
    ).rotate(rotation);

    canvasRef.current
      ?.getContext("2d")
      ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current
      ?.getContext("2d")
      ?.drawImage(
        newImage.getCanvas(),
        (800 - newImage.width) / 2,
        (550 - newImage.height) / 2
      );
  }, [originalImage, rotation, toneCurve]);

  useEffect(() => {
    if (originalImage) {
      update();
    }
  }, [originalImage, update]);

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
        <div
          css={css`
            display: grid;
            gap: 16px;
            align-self: flex-start;
          `}
        >
          <section
            css={css`
              display: grid;
              gap: 8px;
              align-self: flex-start;
            `}
          >
            <span
              css={css`
                font-weight: 600;
              `}
            >
              histogram
            </span>
            <Histogram
              values={histogram}
              onChangeToneCurve={(points) => {
                setToneCurve(points);
                update();
              }}
            />
          </section>
          <section
            css={css`
              display: grid;
              gap: 8px;
              align-self: flex-start;
            `}
          >
            <span
              css={css`
                font-weight: 600;
              `}
            >
              rotation
            </span>
            <input
              type="range"
              min={-180}
              max={180}
              defaultValue={0}
              onChange={(event) => {
                const rotation = Number(event.target.value);
                setRotation(rotation);
                update();
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
};
