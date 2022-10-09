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

    let image = originalImage.clone();
    image = convertImage(
      originalImage,
      (v) => toneCurve[Math.floor((v * 100) / 256)] * 256
    );

    if (rotation !== 0) {
      image = image.rotate(rotation);

      // 画面からはみ出さないように適当にリザイズする(レタッチとしては誤り)
      if ((image.height * image.width) / 800 > 550) {
        image = image.resize({
          width: (image.width * 550) / image.height,
          height: 550,
          preserveAspectRatio: true,
        });
      } else {
        image = image.resize({
          width: 800,
          height: (image.height * 800) / image.width,
          preserveAspectRatio: false,
        });
      }
    }

    canvasRef.current
      ?.getContext("2d")
      ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current
      ?.getContext("2d")
      ?.drawImage(
        image.getCanvas(),
        (800 - image.width) / 2,
        (550 - image.height) / 2
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
