"use client";

import { useState, useMemo, useEffect } from "react";
import { stickers } from "@/data/stickers";
import { pages } from "@/data/stickers";
import StickerCard from "./StickerCard";

const COUNTRIES = ["Todos", ...pages.map((p) => p.country)];
const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: "Todos", value: "all" },
  { label: "Jugadores", value: "player" },
  { label: "Equipos", value: "team" },
  { label: "Estadios", value: "stadium" },
];

interface Props {
  placed: Record<string, string>;
  selectedStickerId: string | null;
  onSelectSticker: (id: string) => void;
  autoCountry?: string;
}

export default function StickerPanel({ placed, selectedStickerId, onSelectSticker, autoCountry }: Props) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState(autoCountry ?? "Todos");

  useEffect(() => {
    if (autoCountry) setCountry(autoCountry);
  }, [autoCountry]);
  const [category, setCategory] = useState("all");
  const [showPlaced, setShowPlaced] = useState(true);

  const placedSet = useMemo(
    () => new Set(Object.values(placed)),
    [placed]
  );

  const filtered = useMemo(() => {
    return stickers.filter((s) => {
      if (!showPlaced && placedSet.has(s.id)) return false;
      if (country !== "Todos" && s.country !== country) return false;
      if (category !== "all" && s.category !== category) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, country, category, showPlaced, placedSet]);

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <input
        type="search"
        placeholder="Buscar figurita..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Filters row */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="shrink-0 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {COUNTRIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="shrink-0 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowPlaced((v) => !v)}
          className={[
            "shrink-0 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
            showPlaced
              ? "bg-stone-100 border-stone-300 text-stone-600"
              : "bg-blue-500 border-blue-500 text-white",
          ].join(" ")}
        >
          {showPlaced ? "Ocultar pegadas" : "Mostrar todas"}
        </button>
      </div>

      {/* Count */}
      <p className="text-xs text-stone-400 font-medium">
        {filtered.length} figurita{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {filtered.map((sticker) => (
          <StickerCard
            key={sticker.id}
            sticker={sticker}
            isSelected={selectedStickerId === sticker.id}
            isPlaced={placedSet.has(sticker.id)}
            onSelect={() => {
              if (placedSet.has(sticker.id)) return;
              onSelectSticker(sticker.id);
            }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-3 sm:col-span-4 text-center text-stone-400 text-sm py-6">
            Sin resultados
          </p>
        )}
      </div>
    </div>
  );
}
