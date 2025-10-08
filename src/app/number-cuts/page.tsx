import SquareSplitterSVG from "./square-splitter";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-stone-100">
      <h3>Split square demo</h3>
      <SquareSplitterSVG
        n={102}
        svgSize={600}
        angleQuantization={9}
        enforceAngles={true}
        S_ratio={1.75}
        B_ratio={2.3}
        max_attempts={10000}
      />
    </div>
  );
}
