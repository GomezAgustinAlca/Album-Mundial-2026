"use client";

import { useState, useEffect, useCallback } from "react";
import { stickers } from "@/data/stickers";

const STORAGE_KEY = "album-mundial-2026-v1";

export function useAlbum() {
  // slotId -> stickerId
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [recentlyPlacedSlot, setRecentlyPlacedSlot] = useState<string | null>(null);
  const [wrongSlotId, setWrongSlotId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlaced(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(placed));
    } catch {}
  }, [placed, hydrated]);

  const placeSticker = useCallback(
    (stickerId: string, slotId: string) => {
      const sticker = stickers.find((s) => s.id === stickerId);
      if (!sticker) return;

      if (sticker.slotId !== slotId) {
        setWrongSlotId(slotId);
        setTimeout(() => setWrongSlotId(null), 400);
        return;
      }

      if (placed[slotId]) return; // already has a sticker

      setPlaced((prev) => ({ ...prev, [slotId]: stickerId }));
      setSelectedStickerId(null);
      setRecentlyPlacedSlot(slotId);
      setTimeout(() => setRecentlyPlacedSlot(null), 400);
    },
    [placed]
  );

  const resetAlbum = useCallback(() => {
    setPlaced({});
    setSelectedStickerId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const placedCount = Object.keys(placed).length;
  const totalCount = stickers.length;

  return {
    placed,
    selectedStickerId,
    setSelectedStickerId,
    currentPage,
    setCurrentPage,
    recentlyPlacedSlot,
    wrongSlotId,
    placeSticker,
    resetAlbum,
    placedCount,
    totalCount,
    hydrated,
  };
}
