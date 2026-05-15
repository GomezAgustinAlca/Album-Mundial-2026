"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { pages, stickers, stickerById } from "@/data/stickers";
import { useAlbum } from "@/hooks/useAlbum";
import AlbumPage from "./AlbumPage";
import StickerPanel from "./StickerPanel";
import StickerCard from "./StickerCard";
import ProgressBar from "./ProgressBar";

export default function Album() {
  const {
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
  } = useAlbum();

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string);
    setSelectedStickerId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;
    placeSticker(active.id as string, over.id as string);
  }

  function handleSlotTap(slotId: string) {
    if (!selectedStickerId) return;
    placeSticker(selectedStickerId, slotId);
  }

  function handleSelectSticker(id: string) {
    setSelectedStickerId((prev) => (prev === id ? null : id));
  }

  const page = pages[currentPage];
  const activeDragSticker = activeDragId ? stickerById[activeDragId] : null;

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <p className="text-stone-500 text-lg animate-pulse">Cargando álbum...</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-stone-100">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-20">
          <div>
            <h1 className="font-black text-base sm:text-lg leading-tight">
              Álbum Mundial 2026
            </h1>
            <p className="text-xs text-slate-400">
              {placedCount}/{totalCount} figuritas pegadas
            </p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-xs bg-slate-700 hover:bg-slate-600 active:bg-slate-800 px-3 py-2 rounded-lg transition-colors"
          >
            Reiniciar
          </button>
        </header>

        {/* ── Main layout ────────────────────────────────────────────── */}
        <main className="max-w-2xl mx-auto px-3 py-4 flex flex-col gap-4">
          {/* Progress */}
          <ProgressBar placed={placed} totalCount={totalCount} />

          {/* Album page area */}
          <div className="flex flex-col gap-3">
            {/* Page navigation top */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-4 py-2 min-h-[44px] rounded-xl bg-white border border-stone-200 shadow-sm font-medium text-sm disabled:opacity-30 active:scale-95 transition-all"
              >
                ← Anterior
              </button>
              <span className="text-sm text-stone-500 font-medium">
                {currentPage + 1} / {pages.length}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
                disabled={currentPage === pages.length - 1}
                className="flex items-center gap-1 px-4 py-2 min-h-[44px] rounded-xl bg-white border border-stone-200 shadow-sm font-medium text-sm disabled:opacity-30 active:scale-95 transition-all"
              >
                Siguiente →
              </button>
            </div>

            {/* Album page */}
            <AlbumPage
              page={page}
              placed={placed}
              selectedStickerId={selectedStickerId}
              recentlyPlacedSlot={recentlyPlacedSlot}
              wrongSlotId={wrongSlotId}
              onSlotTap={handleSlotTap}
            />
          </div>

          {/* Mobile tap hint */}
          {selectedStickerId && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 text-center font-medium">
              Figurita seleccionada: <strong>{stickerById[selectedStickerId]?.name}</strong>
              <br />
              <span className="text-xs font-normal">Tocá el slot correcto para pegarla</span>
            </div>
          )}

          {/* Sticker panel */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-stone-700 mb-3">
              Mis figuritas
            </h2>
            <StickerPanel
              placed={placed}
              selectedStickerId={selectedStickerId}
              onSelectSticker={handleSelectSticker}
              autoCountry={page.country}
            />
          </div>
        </main>
      </div>

      {/* Drag overlay */}
      <DragOverlay dropAnimation={null}>
        {activeDragSticker && (
          <StickerCard
            sticker={activeDragSticker}
            isSelected={false}
            isPlaced={false}
            onSelect={() => {}}
            overlay
          />
        )}
      </DragOverlay>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl">
            <h3 className="font-bold text-lg text-stone-800 mb-2">
              ¿Reiniciar álbum?
            </h3>
            <p className="text-stone-500 text-sm mb-5">
              Se borrarán todas las figuritas pegadas. No se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetAlbum();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm active:scale-95 transition-transform"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
}
