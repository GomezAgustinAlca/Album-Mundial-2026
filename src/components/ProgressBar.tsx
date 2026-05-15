"use client";

import { pages } from "@/data/stickers";
import { stickers } from "@/data/stickers";

interface Props {
  placed: Record<string, string>;
  totalCount: number;
}

export default function ProgressBar({ placed, totalCount }: Props) {
  const placedCount = Object.keys(placed).length;
  const pct = totalCount > 0 ? Math.round((placedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4">
      {/* Overall progress */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-stone-700">Progreso total</span>
        <span className="text-sm font-bold text-blue-600">
          {placedCount}/{totalCount} — {pct}%
        </span>
      </div>
      <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Per-country pills */}
      <div className="mt-3 flex flex-wrap gap-2">
        {pages.map((page) => {
          const pageStickers = stickers.filter((s) => s.pageId === page.id);
          const done = pageStickers.filter((s) => Object.values(placed).includes(s.id)).length;
          const total = pageStickers.length;
          const complete = done === total;
          return (
            <span
              key={page.id}
              className={[
                "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                complete
                  ? "bg-green-100 text-green-700"
                  : "bg-stone-100 text-stone-600",
              ].join(" ")}
            >
              {page.flag} {done}/{total}
            </span>
          );
        })}
      </div>
    </div>
  );
}
