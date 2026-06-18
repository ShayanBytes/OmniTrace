// Masonry.jsx
// The Pinterest-style masonry grid. Tailwind's CSS `columns-*` utilities do
// the true masonry flow; each FileCard avoids breaking across columns via the
// `.masonry-item` rule in index.css.
import { AnimatePresence } from "framer-motion";
import FileCard from "./FileCard.jsx";

export default function Masonry({ files, onAnalyze, analyzingPath }) {
  if (!files?.length) return null;

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      <AnimatePresence>
        {files.map((file, i) => (
          <FileCard
            key={file.path}
            file={file}
            index={i}
            onAnalyze={onAnalyze}
            analyzing={analyzingPath === file.path}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
