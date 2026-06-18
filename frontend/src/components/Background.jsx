// Background.jsx
// Ambient backdrop ported from the Figma hero: a focused violet glow built
// from a couple of large blurred ellipses, a slowly-rotating concentric-circle
// motif, and a radial vignette that fades everything into the near-black
// canvas. Purely decorative and pointer-events-none so it never blocks clicks.
export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      {/* Big soft violet glows (single hue, unlike the old tri-color blobs). */}
      <div className="absolute -top-40 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-excav-violetDeep/30 blur-[180px] animate-float" />
      <div className="absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-excav-violet/20 blur-[140px] animate-drift" />
      <div className="absolute -bottom-48 left-1/4 h-[34rem] w-[34rem] rounded-full bg-excav-violetInk/40 blur-[160px] animate-float" />

      {/* Concentric-circle motif from the Figma hero, drifting in the upper area. */}
      <svg
        className="absolute left-1/2 top-[-18rem] h-[64rem] w-[64rem] -translate-x-1/2 animate-spin-slow opacity-[0.18]"
        viewBox="0 0 800 800"
        fill="none"
        aria-hidden="true"
      >
        {[120, 200, 280, 360].map((r) => (
          <circle
            key={r}
            cx="400"
            cy="400"
            r={r}
            stroke="url(#circleGrad)"
            strokeWidth="1"
          />
        ))}
        <defs>
          <radialGradient id="circleGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8c45ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8c45ff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Radial vignette so content sits on calm near-black toward the edges. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,#040308_75%)]" />
    </div>
  );
}
