import "./App.css";
import { Image } from "image-js";
import { useEffect, useMemo, useRef, useState } from "react";
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

const PreviewCanvas = ({
  image,
  rotationAngle,
  onChangeRotationAngle,
}: {
  image?: Image;
  rotationAngle?: number;
  onChangeRotationAngle?: (angle: number) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);

  if (canvasRef.current && !imageCanvasRef.current) {
    imageCanvasRef.current = document.createElement("canvas");
    imageCanvasRef.current.width = canvasRef.current.width;
    imageCanvasRef.current.height = canvasRef.current.height;
  }

  useEffect(() => {
    const ctx = imageCanvasRef.current?.getContext("2d");
    if (ctx && image) {
      ctx.drawImage(
        image.getCanvas(),
        (800 - image.width) / 2,
        (550 - image.height) / 2
      );
    }
  }, [image]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.save();
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        if (rotationAngle !== undefined) {
          ctx.translate(
            canvasRef.current.width / 2,
            canvasRef.current.height / 2
          );
          ctx.rotate((rotationAngle * Math.PI) / 180);
          ctx.translate(
            -canvasRef.current.width / 2,
            -canvasRef.current.height / 2
          );
        }
        if (imageCanvasRef.current) {
          ctx.drawImage(
            imageCanvasRef.current,
            (800 - imageCanvasRef.current.width) / 2,
            (550 - imageCanvasRef.current.height) / 2
          );
        }
        ctx.restore();
      }
    }
  }, [image, rotationAngle]);

  const [dragState, setDragState] = useState<{
    x: number;
    y: number;
    rotation: number;
  } | null>(null);

  return (
    <canvas
      width={800}
      height={550}
      ref={canvasRef}
      css={[
        css`
          background-color: black;
        `,
        {
          cursor: dragState ? "grabbing" : "grab",
        },
      ]}
      onMouseDown={(event) => {
        if (!canvasRef.current || rotationAngle === undefined) {
          return;
        }
        const rect = canvasRef.current.getBoundingClientRect();

        setDragState({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          rotation: rotationAngle,
        });
      }}
      onMouseMove={(event) => {
        if (rotationAngle === undefined || !canvasRef.current) {
          return;
        }

        const rect = canvasRef.current.getBoundingClientRect();

        if (dragState) {
          const origin = [
            canvasRef.current.width / 2,
            canvasRef.current.height / 2,
          ];
          const before = [dragState.x - origin[0], dragState.y - origin[1]];
          const after = [
            event.clientX - rect.left - origin[0],
            event.clientY - rect.top - origin[1],
          ];

          const angle =
            Math.atan2(
              before[0] * after[1] - before[1] * after[0],
              before[0] * after[0] + before[1] * after[1]
            ) *
            (180 / Math.PI);
          onChangeRotationAngle?.(dragState.rotation + angle);
        }
      }}
      onMouseUp={() => {
        setDragState(null);
      }}
      onMouseLeave={() => {
        setDragState(null);
      }}
    />
  );
};

export const App = () => {
  const { image: originalImage, histogram } = useFetchImage(
    "https://picsum.photos/seed/picsum/800/550"
  );

  const [toneCurve, setToneCurve] = useState<number[]>([]);
  const [rotation, setRotation] = useState(0);
  const [hsv, setHsv] = useState({ h: 0, s: 0, v: 0 });

  const image = useMemo(
    () =>
      originalImage
        ? convertImage(originalImage, (vs) =>
            vs.map((v) => toneCurve[Math.floor((v * 100) / 256)] * 256)
          )
        : undefined,
    [originalImage, toneCurve]
  );

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
            display: grid;
            gap: 16px;
            align-self: flex-start;
          `}
        >
          <PreviewCanvas
            image={image}
            rotationAngle={rotation}
            onChangeRotationAngle={setRotation}
          />
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
              rotation ({rotation.toFixed(2)})
            </span>
            <input
              type="range"
              min={-180}
              max={180}
              value={rotation}
              onChange={(event) => {
                const rotation = Number(event.target.value);
                setRotation(rotation);
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
              HSV
            </span>
            <input
              type="range"
              min={0}
              max={360}
              value={hsv.h}
              onChange={(event) => {
                const value = Number(event.target.value);
                setHsv((hsv) => ({ ...hsv, h: value }));
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
};
