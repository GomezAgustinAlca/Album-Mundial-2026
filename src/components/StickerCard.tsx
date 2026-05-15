"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Sticker } from "@/types";

interface Props {
  sticker: Sticker;
  isSelected: boolean;
  isPlaced: boolean;
  onSelect: () => void;
  /** When true, renders a plain non-draggable card (used in DragOverlay) */
  overlay?: boolean;
}

const COUNTRY_COLOR: Record<string, string> = {
  Argentina: "#75AADB",
  Brasil: "#FFD700",
  Francia: "#003189",
  España: "#AA151B",
  Alemania: "#000000",
  Inglaterra: "#CF0E20",
};

export default function StickerCard({
  sticker,
  isSelected,
  isPlaced,
  onSelect,
  overlay = false,
}: Props) {
  const [imgError, setImgError] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: sticker.id, disabled: isPlaced || overlay });

  const bandColor = COUNTRY_COLOR[sticker.country] ?? "#555555";

  const dragTransform = transform ? CSS.Translate.toString(transform) : "";
  const scaleTransform = isSelected && !isDragging && !overlay ? "scale(1.05)" : "";
  const overlayTransform = overlay ? "scale(1.1) rotate(2deg)" : "";
  const combinedTransform =
    [dragTransform, scaleTransform, overlayTransform].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={{
        width: 80,
        height: 110,
        transform: combinedTransform,
        border: `3px solid ${isSelected ? "#FFD700" : "#ffffff"}`,
        filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.4))",
        flexShrink: 0,
      }}
      {...(overlay ? {} : listeners)}
      {...(overlay ? {} : attributes)}
      onClick={!isPlaced && !overlay ? onSelect : undefined}
      className={[
        "relative rounded-lg overflow-hidden cursor-pointer select-none transition-all duration-150",
        isPlaced ? "opacity-50 cursor-default" : "",
        isDragging ? "opacity-20" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Image area — top 70% */}
      <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ bottom: "30%" }}>
        {imgError ? (
          <div
            className="w-full h-full flex items-center justify-center font-bold text-2xl text-white"
            style={{ backgroundColor: bandColor }}
          >
            {sticker.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <img
            src={sticker.imageUrl}
            alt={sticker.name}
            className="w-full h-full object-cover object-top"
            draggable={false}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Number badge — gold circle top-left */}
      <div
        className="absolute top-[5px] left-[5px] z-10 rounded-full flex items-center justify-center font-bold text-white"
        style={{
          width: 18,
          height: 18,
          fontSize: 8,
          backgroundColor: "#C9A84C",
          boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
        }}
      >
        {sticker.number}
      </div>

      {/* Country color band — bottom 30% */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center justify-center px-1"
        style={{ height: "30%", backgroundColor: bandColor }}
      >
        <p className="text-white font-bold text-center leading-tight truncate w-full"
           style={{ fontSize: 8 }}>
          {sticker.name}
        </p>
      </div>

      {/* Placed: green check overlay */}
      {isPlaced && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="text-green-400 text-2xl drop-shadow-md">✓</span>
        </div>
      )}
    </div>
  );
}
