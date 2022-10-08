import { css } from "@emotion/react";
import { useMemo, useState } from "react";
import { clamp } from "../helper/clamp";
import { curve } from "../helper/curve";

export const Histogram = ({
  values,
  onChangeToneCurve,
}: {
  values?: number[];
  onChangeToneCurve?: (points: number[]) => void;
}) => {
  const [dragElement, setDragElement] = useState<SVGCircleElement | null>(null);
  const [points, setPoints] = useState<{ id: string; x: number; y: number }[]>([
    { id: "start", x: 0, y: 0 },
    { id: "end", x: 1, y: 1 },
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
      css={css`
        overflow: visible;
      `}
      onMouseMove={(event) => {
        // dragging
        if (dragElement) {
          event.preventDefault();
          const ctm = dragElement.getScreenCTM();
          if (!ctm) {
            return;
          }

          const dragX = clamp((event.clientX - ctm.e) / ctm.a, 0, 256);
          const dragY = clamp((event.clientY - ctm.f) / ctm.d, 0, 256);

          const index = points.findIndex(
            (p) => p.id === dragElement.dataset.id
          );

          if (index != undefined) {
            const point = points[index];
            // Lock x for start and end
            if (point.id !== "start" && point.id !== "end") {
              points[Number(index)].x = dragX / 256;
              dragElement.setAttribute("cx", `${dragX}`);
            }

            points[Number(index)].y = 1.0 - dragY / 256;
            dragElement.setAttribute("cy", `${dragY}`);

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
      {/* 以下のcurveのpathのクリック領域を拡張するための別のpath */}
      <path
        d={[
          `M0,${256 - toneCurvePoints[0] * 256}`,
          ...toneCurvePoints.map(
            (t, i) => `L${(i * 256) / 100},${256 - t * 256}`
          ),
        ].join(" ")}
        fill="none"
        stroke="rgba(0,0,0,0.0)"
        strokeWidth={30}
        css={css`
          cursor: pointer;
        `}
        onClick={(event) => {
          event.preventDefault();
          const ctm = event.currentTarget.getScreenCTM();
          if (!ctm) {
            return;
          }

          const dragX = (event.clientX - ctm.e) / ctm.a;
          const dragY = (event.clientY - ctm.f) / ctm.d;

          const newPoints = [
            ...points,
            {
              id: `${new Date().getTime()}`,
              x: dragX / 256,
              y: 1.0 - dragY / 256,
            },
          ];
          newPoints.sort((a, b) => a.x - b.x);
          setPoints(newPoints);
        }}
      />
      <path
        d={[
          `M0,${256 - toneCurvePoints[0] * 256}`,
          ...toneCurvePoints.map(
            (t, i) => `L${(i * 256) / 100},${256 - t * 256}`
          ),
        ].join(" ")}
        fill="none"
        stroke="#1e293b"
        strokeWidth={1}
      />
      {/* handle */}
      {points.map((point) => (
        <circle
          key={point.id}
          cx={point.x * 256}
          cy={(1.0 - point.y) * 256}
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
          onDoubleClick={() => {
            const index = points.findIndex((p) => p.id === point.id);
            if (index !== -1) {
              points.splice(Number(index), 1);
              setPoints([...points]);
            }
          }}
          data-id={point.id}
        />
      ))}
    </svg>
  );
};
