// Background.jsx
// Soft, slowly-drifting gradient blobs that give the dark UI depth.
// Purely decorative and pointer-events-none so they never block clicks.
export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-violet-600/25 blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-24 h-[26rem] w-[26rem] rounded-full bg-cyan-500/20 blur-3xl animate-drift" />
      <div className="absolute -bottom-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/15 blur-3xl animate-float" />
    </div>
  );
}
