// FileCard.jsx
// A single "artifact" card in the masonry grid. The card tilts in 3D toward
// the cursor (real perspective transform via Framer Motion motion values),
// lifts on hover, and shows a moving glare highlight. Varying internal
// content gives the cards different heights → the Pinterest masonry look.
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { riskLevel, splitPath, timeAgo } from "../utils.js";

// How many degrees the card may tilt at the extremes.
const MAX_TILT = 12;

export default function FileCard({ file, index, onAnalyze, analyzing }) {
  const risk = riskLevel(file);
  const { name, dir } = splitPath(file.path);

  // Raw pointer position within the card, normalized to [-0.5, 0.5].
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Springy rotation feels nicer than snapping straight to the value.
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), {
    stiffness: 220,
    damping: 18,
  });
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), {
    stiffness: 220,
    damping: 18,
  });

  // Glare follows the cursor across the surface.
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18), transparent 45%)`;

  function handleMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  // A little vertical padding variety so heights differ across the grid.
  const pad = [["pb-5"], ["pb-7"], ["pb-6"]][index % 3];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.45, ease: "easeOut" }}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ y: -6 }}
      className={`masonry-item group relative mb-4 cursor-pointer rounded-2xl ${pad} glass ring-1 ${risk.ring} ${risk.glow} transition-shadow`}
      onClick={() => !analyzing && onAnalyze(file)}
    >
      {/* Moving glare layer */}
      <motion.div
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Accent top bar */}
      <div className={`h-1.5 w-full rounded-t-2xl bg-gradient-to-r ${risk.accent}`} />

      <div className="px-4 pt-4" style={{ transform: "translateZ(40px)" }}>
        {/* Header: filename + risk badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-slate-100" title={file.path}>
              {name}
            </h3>
            {dir && (
              <p className="truncate text-[11px] text-slate-500" title={dir}>
                {dir}/
              </p>
            )}
          </div>
          <span
            className={`shrink-0 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium ${risk.text} ring-1 ring-white/10`}
          >
            <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${risk.dot}`} />
            {risk.label}
          </span>
        </div>

        {/* Big "days idle" headline — the abandonment metric */}
        <div className="mt-4 flex items-end gap-2">
          <span className="text-3xl font-bold leading-none text-gradient">
            {file.days_idle}
          </span>
          <span className="pb-0.5 text-xs text-slate-400">days idle</span>
        </div>

        {/* Last commit line */}
        <div className="mt-3 rounded-lg bg-black/30 p-2.5 ring-1 ring-white/5">
          <p className="line-clamp-2 text-xs italic text-slate-300">
            “{file.message || "no message"}”
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {file.author || "unknown"} · {timeAgo(file.last_commit)}
          </p>
        </div>

        {/* Complexity metrics (only when Lizard could analyze the file) */}
        {file.analyzed ? (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Metric value={file.nloc} label="lines" />
            <Metric value={file.function_count} label="funcs" />
            <Metric
              value={file.max_complexity}
              label="max cx"
              warn={file.max_complexity >= 10}
            />
          </div>
        ) : (
          <div className="mt-3 text-[11px] text-slate-500">
            Not a source file — complexity skipped.
          </div>
        )}

        {/* Analyze CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!analyzing) onAnalyze(file);
          }}
          disabled={analyzing}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2 text-xs font-semibold text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 hover:text-white disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1" />
          </svg>
          {analyzing ? "Reading the dig site…" : "Excavate with AI"}
        </button>
      </div>
    </motion.article>
  );
}

function Metric({ value, label, warn }) {
  return (
    <div className="rounded-lg bg-black/30 py-1.5 ring-1 ring-white/5">
      <div className={`text-sm font-bold ${warn ? "text-rose-300" : "text-slate-100"}`}>
        {value ?? 0}
      </div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}
