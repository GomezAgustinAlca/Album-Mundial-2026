import fs from "fs";
import path from "path";

const FILE = path.resolve(process.cwd(), "src/data/stickers.ts");

interface PlayerResult {
  strCutout?: string;
  strThumb?: string;
}

async function fetchPhoto(name: string): Promise<string | null> {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as { player: PlayerResult[] | null };
    const player = data?.player?.[0];
    if (!player) return null;
    const cutout = player.strCutout?.trim();
    if (cutout) return cutout;
    const thumb = player.strThumb?.trim();
    if (thumb) return thumb;
    return null;
  } catch {
    return null;
  }
}

function avatarFallback(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=160&background=random&color=fff&bold=true`;
}

interface StickerEntry {
  number: number;
  name: string;
  category: string;
  oldUrl: string;
}

function parseStickers(content: string): StickerEntry[] {
  const re =
    /\{[\s\S]*?number:\s*(\d+)[\s\S]*?name:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?imageUrl:\s*"([^"]+)"[\s\S]*?\}/g;
  const results: StickerEntry[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    results.push({
      number: parseInt(m[1], 10),
      name: m[2],
      category: m[3],
      oldUrl: m[4],
    });
  }
  return results;
}

async function main(): Promise<void> {
  let content = fs.readFileSync(FILE, "utf-8");
  const stickers = parseStickers(content);
  const players = stickers.filter((s) => s.category === "player");

  console.log(`Encontrados ${players.length} jugadores. Buscando fotos...\n`);

  for (const sticker of players) {
    process.stdout.write(`  [${sticker.number}] ${sticker.name}... `);
    const photo = await fetchPhoto(sticker.name);
    const newUrl = photo ?? avatarFallback(sticker.name);
    console.log(photo ? `✓ foto encontrada` : `✗ usando ui-avatars`);

    content = content.replace(
      `imageUrl: "${sticker.oldUrl}"`,
      `imageUrl: "${newUrl}"`
    );
  }

  fs.writeFileSync(FILE, content, "utf-8");
  console.log(
    `\n¡Listo! ${players.length} jugadores actualizados en stickers.ts.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
