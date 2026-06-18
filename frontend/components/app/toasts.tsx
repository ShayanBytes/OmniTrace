"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export type ToastTone = "info" | "success" | "error";
export type Toast = { id: number; message: string; tone: ToastTone };

/** Minimal toast queue hook. */
export function useToasts() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const seq = React.useRef(0);

  const addToast = React.useCallback((message: string, tone: ToastTone = "info") => {
    const id = ++seq.current;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);

  const dismiss = React.useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return { toasts, addToast, dismiss };
}

const ICONS = {
  info: Info,
  success: CheckCircle2,
  error: XCircle,
} as const;

const TONES = {
  info: "ring-excav-violet/40 text-excav-lilac",
  success: "ring-emerald-400/40 text-emerald-200",
  error: "ring-rose-400/40 text-rose-200",
} as const;

export function Toasts({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`glass pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-slate-100 ring-1 ${TONES[t.tone]}`}
            >
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 18 }}
              >
                <Icon className="h-4 w-4 shrink-0" />
              </motion.span>
              <span>{t.message}</span>
              <button
                onClick={() => onDismiss(t.id)}
                className="ml-1 text-slate-500 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
