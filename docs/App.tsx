import "./App.css";
import { Image } from "image-js";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { css } from "@emotion/react";
import { convertImage } from "../src/helper/image";
import { Histogram } from "../src/Histogram";

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
  const [clipArea, setClipArea] = useState({
    x: 100,
    y: 200,
    width: 140,
    height: 250,
  });
  console.log(clipArea);

  const [, startTransition] = useTransition();
  const update = useCallback(() => {
    startTransition(() => {
      if (!originalImage) {
        return;
      }

      let image = originalImage.clone();
      image = convertImage(
        originalImage,
        (v) => toneCurve[Math.floor((v * 100) / 256)] * 256
      );

      // rotateは重い処理なので毎回走らせるべきではない
      // canvas上はプレビューと割り切ってcanvasでrotateしたものと実際に保存するimageを分けるなどの対応が必要
      if (rotation !== 0) {
        image = image.rotate(rotation);

        const rotationInRadian = (rotation * Math.PI) / 180;
        const width =
          550 /
          ((550 / 800) * Math.cos(rotationInRadian) +
            Math.sin(rotationInRadian));
        const height =
          550 /
          ((800 / 550) * Math.sin(rotationInRadian) +
            Math.cos(rotationInRadian));
        setClipArea({
          x: (800 - width) / 2,
          y: (550 - height) / 2,
          width,
          height,
        });
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
    });
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
        <div
          css={css`
            position: relative;
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
          <svg
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            `}
          >
            <rect
              x={clipArea.x}
              y={clipArea.y}
              width={clipArea.width}
              height={clipArea.height}
              fill="none"
              stroke="white"
              strokeWidth={2}
            />
          </svg>
        </div>
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
