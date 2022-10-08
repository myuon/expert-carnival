export const Graph = ({ values }: { values?: number[] }) => {
  return (
    <svg width={100} height={100}>
      <path
        d="M0,0 L0,100 L100,100 L100,0 L0,0"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth={3}
      />
      {/* grid */}
      <path d="M0,128 L100,128" fill="none" stroke="#cbd5e1" strokeWidth={1} />
      <path d="M128,0 L128,100" fill="none" stroke="#cbd5e1" strokeWidth={1} />
      <path d="M64,0 L64,100" fill="none" stroke="#e2e8f0" strokeWidth={1} />
      <path d="M192,0 L192,100" fill="none" stroke="#e2e8f0" strokeWidth={1} />
      <path d="M0,64 L100,64" fill="none" stroke="#e2e8f0" strokeWidth={1} />
      <path d="M0,192 L100,192" fill="none" stroke="#e2e8f0" strokeWidth={1} />
      {/* graph */}
      {values && (
        <path
          d={[
            "M0,100",
            ...(values?.map((t, i) => `L${i},${100 - t * 100}`) ?? []),
            "L100,100",
          ].join(" ")}
          fill="#a5b4fc"
          stroke="#4f46e5"
          strokeWidth={1}
        />
      )}
      {/* line */}
      <path d="M0,100 L100,0" fill="none" stroke="#1e293b" strokeWidth={1} />
    </svg>
  );
};
