import { css } from "@emotion/react";
import { useMemo, useState } from "react";
import { curve } from "../helper/curve";

export const Histogram = ({
  values,
  onChangeToneCurve,
}: {
  values?: number[];
  onChangeToneCurve?: (points: number[]) => void;
}) => {
  const [dragElement, setDragElement] = useState<SVGCircleElement | null>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.5, y: 0.5 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);
  const toneCurvePoints = useMemo(() => {
    const newPoints = curve(points);
    onChangeToneCurve?.(newPoints);

    return newPoints;
  }, [points]);

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

          const dragX = (event.clientX - ctm.e) / ctm.a;
          const dragY = (event.clientY - ctm.f) / ctm.d;

          dragElement.setAttribute("cx", `${dragX}`);
          dragElement.setAttribute("cy", `${dragY}`);

          const index = dragElement.dataset.pointIndex;
          if (index) {
            points[Number(index)].x = dragX / 256;
            points[Number(index)].y = 1.0 - dragY / 256;
            setPoints([...points]);
          }
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
      {/* curve */}
      <path
        d={[
          "M0,256",
          ...toneCurvePoints.map(
            (t, i) => `L${(i * 256) / 100},${256 - t * 256}`
          ),
        ].join(" ")}
        fill="none"
        stroke="#1e293b"
        strokeWidth={1}
      />
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
        data-point-index={2}
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
        data-point-index={1}
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
        data-point-index={3}
      />
      <circle
        cx={0}
        cy={256}
        r={4}
        fill="#cbd5e1"
        stroke="#1e293b"
        strokeWidth={1}
        data-point-index={0}
      />
      <circle
        cx={256}
        cy={0}
        r={4}
        fill="#cbd5e1"
        stroke="#1e293b"
        strokeWidth={1}
        data-point-index={4}
      />
    </svg>
  );
};
