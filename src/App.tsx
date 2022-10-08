import "./App.css";
import { Image } from "image-js";
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";

const Histogram = ({ values }: { values?: number[] }) => {
  const [dragElement, setDragElement] = useState<SVGCircleElement | null>(null);

  return (
    <svg
      width={256}
      height={256}
      onMouseMove={(event) => {
        // dragging
        if (dragElement) {
          event.preventDefault();
          const ctm = dragElement.getScreenCTM();
          if (!ctm) {
            return;
          }

          // const dragX = (event.clientX - ctm.e) / ctm.a;
          const dragY = (event.clientY - ctm.f) / ctm.d;

          // dragElement.setAttribute("cx", `${dragX}`);
          dragElement.setAttribute("cy", `${dragY}`);
        }
      }}
      onMouseUp={() => {
        // stop dragging
        setDragElement(null);
      }}
      onMouseLeave={() => {
        // stop dragging
        setDragElement(null);
      }}
    >
      <path
        d="M0,0 L0,256 L256,256 L256,0 L0,0"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth={3}
      />
      {/* grid */}
      <path d="M0,128 L256,128" fill="none" stroke="#cbd5e1" strokeWidth={1} />
      <path d="M128,0 L128,256" fill="none" stroke="#cbd5e1" strokeWidth={1} />
      <path d="M64,0 L64,256" fill="none" stroke="#e2e8f0" strokeWidth={1} />
      <path d="M192,0 L192,256" fill="none" stroke="#e2e8f0" strokeWidth={1} />
      <path d="M0,64 L256,64" fill="none" stroke="#e2e8f0" strokeWidth={1} />
      <path d="M0,192 L256,192" fill="none" stroke="#e2e8f0" strokeWidth={1} />
      {/* graph */}
      {values && (
        <path
          d={[
            "M0,256",
            ...(values?.map((t, i) => `L${i},${256 - (t * 256) / 20000}`) ??
              []),
            "L256,256",
          ].join(" ")}
          fill="#a5b4fc"
          stroke="#4f46e5"
          strokeWidth={1}
        />
      )}
      {/* line */}
      <path d="M0,256 L256,0" fill="none" stroke="#1e293b" strokeWidth={1} />
      {/* handle */}
      <circle
        cx={128}
        cy={128}
        r={4}
        fill="#cbd5e1"
        stroke="#1e293b"
        strokeWidth={1}
        css={css`
          cursor: move;
        `}
        onMouseDown={(event) => {
          setDragElement(event.currentTarget);
        }}
      />
      <circle
        cx={64}
        cy={192}
        r={4}
        fill="#cbd5e1"
        stroke="#1e293b"
        strokeWidth={1}
        css={css`
          cursor: move;
        `}
        onMouseDown={(event) => {
          setDragElement(event.currentTarget);
        }}
      />
      <circle
        cx={192}
        cy={64}
        r={4}
        fill="#cbd5e1"
        stroke="#1e293b"
        strokeWidth={1}
        css={css`
          cursor: move;
        `}
        onMouseDown={(event) => {
          setDragElement(event.currentTarget);
        }}
      />
      <circle
        cx={0}
        cy={256}
        r={4}
        fill="#cbd5e1"
        stroke="#1e293b"
        strokeWidth={1}
      />
      <circle
        cx={256}
        cy={0}
        r={4}
        fill="#cbd5e1"
        stroke="#1e293b"
        strokeWidth={1}
      />
    </svg>
  );
};

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
