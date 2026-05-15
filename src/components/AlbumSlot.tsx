"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Sticker } from "@/types";

const COUNTRY_COLOR: Record<string, string> = {
  Argentina: "#75AADB",
  Brasil: "#FFD700",
  Francia: "#003189",
  España: "#AA151B",
  Alemania: "#000000",
  Inglaterra: "#CF0E20",
};

const CATEGORY_LABEL: Record<string, string> = {
  player: "Jugador",
  team: "Equipo",
  stadium: "Estadio",
  special: "Especial",
};

interface Props {
  slotId: string;
  expectedSticker: Sticker;
  placedSticker: Sticker | undefined;
  isSelectedTarget: boolean;
  isRecentlyPlaced: boolean;
  isWrong: boolean;
  onTap: () => void;
}

export default function AlbumSlot({
  slotId,
  expectedSticker,
  placedSticker,
  isSelectedTarget,
  isRecentlyPlaced,
  isWrong,
  onTap,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: slotId });
  const isEmpty = !placedSticker;

  const borderColor = isOver || isSelectedTarget
    ? "#4B9EFF"
    : isWrong
    ? "#EF4444"
    : "#C9A84C";

  return (
    <div
      ref={setNodeRef}
      onClick={onTap}
      className={[
        "relative overflow-hidden rounded-lg cursor-pointer select-none transition-colors duration-150",
        // fixed size: 100×130 mobile, 140×180 desktop
        "w-[100px] h-[130px] sm:w-[140px] sm:h-[180px]",
        isEmpty ? "bg-[#F5F0E8]" : "",
        isWrong ? "animate-shake" : "",
        isSelectedTarget && isEmpty ? "animate-selectPulse" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        isEmpty
          ? { border: `2px dashed ${borderColor}` }
          : undefined
      }
    >
      {placedSticker ? (
        /* Filled: sticker fills the entire slot */
        <div
          className={[
            "absolute inset-0 flex flex-col",
            isRecentlyPlaced ? "animate-placeSticker" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Image top 70% */}
          <div className="flex-1 overflow-hidden">
            <img
              src={placedSticker.imageUrl}
              alt={placedSticker.name}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
          </div>
          {/* Name band bottom 30% */}
          <div
            className="flex items-center justify-center px-1 shrink-0"
            style={{
              height: "30%",
              backgroundColor: COUNTRY_COLOR[placedSticker.country] ?? "#555",
            }}
          >
            <p
              className="text-white font-bold text-center leading-tight truncate w-full"
              style={{ fontSize: 8 }}
            >
              {placedSticker.name}
            </p>
          </div>
        </div>
      ) : (
        /* Empty: number + category label in gold */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3px] px-1">
          <span
            className="font-bold text-xl sm:text-2xl leading-none"
            style={{ color: "#C9A84C" }}
          >
            #{expectedSticker.number}
          </span>
          <span
            className="uppercase tracking-wide font-medium text-center"
            style={{ fontSize: 8, color: "#C9A84C", opacity: 0.75 }}
          >
            {CATEGORY_LABEL[expectedSticker.category]}
          </span>
          <span
            className="text-center leading-tight truncate max-w-[80px]"
            style={{ fontSize: 7, color: "#C9A84C", opacity: 0.6 }}
          >
            {expectedSticker.name}
          </span>
        </div>
      )}
    </div>
  );
}
