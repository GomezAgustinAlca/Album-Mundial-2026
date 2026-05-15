"use client";

import type { PageData } from "@/types";
import { stickers, stickerById } from "@/data/stickers";
import AlbumSlot from "./AlbumSlot";

interface Props {
  page: PageData;
  placed: Record<string, string>;
  selectedStickerId: string | null;
  recentlyPlacedSlot: string | null;
  wrongSlotId: string | null;
  onSlotTap: (slotId: string) => void;
}

export default function AlbumPage({
  page,
  placed,
  selectedStickerId,
  recentlyPlacedSlot,
  wrongSlotId,
  onSlotTap,
}: Props) {
  const pageStickers = page.stickerIds.map((id) =>
    stickers.find((s) => s.id === id)!
  );

  const selectedSticker = selectedStickerId
    ? stickers.find((s) => s.id === selectedStickerId)
    : null;

  const placedOnPage = pageStickers.filter((s) => placed[s.slotId]).length;
  const total = pageStickers.length;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        /* layered shadow for book-like depth */
        boxShadow: [
          "0 1px 3px rgba(0,0,0,0.12)",
          "0 4px 8px rgba(0,0,0,0.08)",
          "4px 4px 0 rgba(0,0,0,0.06)",
          "6px 6px 0 rgba(0,0,0,0.03)",
        ].join(", "),
      }}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${page.headerColor} px-4 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none">{page.flag}</span>
            <h2 className="text-white font-bold text-xl drop-shadow-sm">
              {page.title}
            </h2>
          </div>
          {/* Counter badge */}
          <div
            className="flex items-center gap-[2px] rounded-full px-3 py-1 font-bold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            <span>{placedOnPage}</span>
            <span style={{ opacity: 0.65 }}>/{total}</span>
          </div>
        </div>
      </div>

      {/* Slots — parchment background with subtle dot texture */}
      <div
        className="p-4 flex flex-wrap gap-3 sm:gap-4 justify-center"
        style={{
          backgroundColor: "#FFFEF5",
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        {pageStickers.map((expected) => {
          const placedStickerId = placed[expected.slotId];
          const placedSticker = placedStickerId
            ? stickerById[placedStickerId]
            : undefined;

          const isSelectedTarget =
            !!selectedSticker &&
            !placedSticker &&
            selectedSticker.pageId === page.id;

          return (
            <AlbumSlot
              key={expected.slotId}
              slotId={expected.slotId}
              expectedSticker={expected}
              placedSticker={placedSticker}
              isSelectedTarget={isSelectedTarget}
              isRecentlyPlaced={recentlyPlacedSlot === expected.slotId}
              isWrong={wrongSlotId === expected.slotId}
              onTap={() => !placedSticker && onSlotTap(expected.slotId)}
            />
          );
        })}
      </div>
    </div>
  );
}
