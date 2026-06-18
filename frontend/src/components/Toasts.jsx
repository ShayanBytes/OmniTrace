// Toasts.jsx
// A minimal, dependency-free toast stack. App owns the list and an
// `addToast` helper; this just renders + animates them in the corner.
import { AnimatePresence, motion } from "framer-motion";

const TONE = {
  info: "ring-violet-400/40 text-violet-100",
  success: "ring-emerald-400/40 text-emerald-100",
  error: "ring-rose-400/40 text-rose-100",
};

export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={() => onDismiss(t.id)}
            className={`glass pointer-events-auto flex cursor-pointer items-start gap-2 rounded-xl px-3.5 py-2.5 text-sm shadow-glow ring-1 ${
              TONE[t.tone] || TONE.info
            }`}
          >
            <span className="mt-0.5">{ICON[t.tone] || ICON.info}</span>
            <span className="flex-1 leading-snug">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const ICON = {
  info: "💬",
  success: "✅",
  error: "⚠️",
};
