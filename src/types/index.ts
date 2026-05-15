export interface Sticker {
  id: string;
  name: string;
  country: string;
  category: "player" | "team" | "stadium" | "special";
  pageId: string;
  slotId: string;
  imageUrl: string;
  number: number;
}

export interface PageData {
  id: string;
  title: string;
  country: string;
  flag: string;
  headerColor: string;
  stickerIds: string[];
}
