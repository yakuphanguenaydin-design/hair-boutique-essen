#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const defaultConfigPath = path.join(rootDir, "instagram-images.json");

function parseArgs(argv) {
  const args = {
    slug: "",
    links: "",
    force: false,
    config: defaultConfigPath,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--slug") args.slug = argv[i + 1] ?? "";
    if (token === "--links") args.links = argv[i + 1] ?? "";
    if (token === "--config") args.config = path.resolve(rootDir, argv[i + 1] ?? "instagram-images.json");
    if (token === "--force") args.force = true;
  }

  return args;
}

function sanitizeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseLinks(input) {
  if (!input) return [];
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractPostInfo(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    const typeIndex = parts.findIndex((part) => part === "p" || part === "reel" || part === "reels");
    if (typeIndex === -1 || !parts[typeIndex + 1]) {
      return { ok: false, reason: "Kein gueltiger Instagram-Post-Link" };
    }

    const type = parts[typeIndex];
    const shortcode = parts[typeIndex + 1];
    return {
      ok: true,
      shortcode,
      mediaUrl: `https://www.instagram.com/${type}/${shortcode}/media?size=l`,
    };
  } catch {
    return { ok: false, reason: "Ungueltige URL" };
  }
}

function buildImportedConfigFile({ slug, galleryCount }) {
  const hero = `/imported/${slug}/hero.jpg`;
  const services = [];
  const gallery = Array.from({ length: galleryCount }, (_, i) => `/imported/${slug}/gallery-${i + 1}.jpg`);
  const about = "";

  return `export type ImportedImagesConfig = {
  enabled: boolean;
  slug: string;
  hero: string;
  services: string[];
  gallery: string[];
  about: string;
};

export const importedImagesConfig: ImportedImagesConfig = {
  enabled: true,
  slug: "${slug}",
  hero: "${hero}",
  services: ${JSON.stringify(services, null, 2)},
  gallery: ${JSON.stringify(gallery, null, 2)},
  about: ${JSON.stringify(about)},
};
`;
}

async function readConfig(configPath) {
  try {
    const raw = await fs.readFile(configPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const config = await readConfig(args.config);

  const slugRaw = args.slug || config.slug || "instagram-import";
  const slug = sanitizeSlug(slugRaw);
  const links = args.links ? parseLinks(args.links) : Array.isArray(config.links) ? config.links : [];
  const force = args.force || Boolean(config.force);

  if (!slug) {
    console.error("Fehler: Kein gueltiger slug vorhanden.");
    process.exit(1);
  }

  if (links.length === 0) {
    console.error("Fehler: Keine Links angegeben. Nutze --links oder instagram-images.json");
    process.exit(1);
  }

  const targetDir = path.join(rootDir, "public", "imported", slug);
  await fs.mkdir(targetDir, { recursive: true });

  const successes = [];
  const failures = [];

  for (const rawLink of links) {
    const post = extractPostInfo(rawLink);
    if (!post.ok) {
      failures.push({ link: rawLink, reason: post.reason });
      continue;
    }

    try {
      const response = await fetch(post.mediaUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "image/*,*/*;q=0.8",
          Referer: "https://www.instagram.com/",
        },
      });

      if (!response.ok) {
        failures.push({ link: rawLink, reason: `HTTP ${response.status}` });
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.toLowerCase().startsWith("image/")) {
        failures.push({ link: rawLink, reason: `Ungueltiger Content-Type: ${contentType || "unknown"}` });
        continue;
      }

      const fileName = successes.length === 0 ? "hero.jpg" : `gallery-${successes.length}.jpg`;
      const filePath = path.join(targetDir, fileName);

      if (!force) {
        try {
          await fs.access(filePath);
          failures.push({ link: rawLink, reason: `${fileName} existiert bereits (nutze --force)` });
          continue;
        } catch {
          // file does not exist, continue
        }
      }

      const arrayBuffer = await response.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      successes.push({ link: rawLink, file: path.posix.join("public", "imported", slug, fileName) });
    } catch (error) {
      failures.push({
        link: rawLink,
        reason: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  }

  if (successes.length > 0) {
    const galleryCount = Math.max(successes.length - 1, 0);
    const configContent = buildImportedConfigFile({ slug, galleryCount });
    const configFilePath = path.join(rootDir, "src", "config", "importedImages.ts");
    await fs.writeFile(configFilePath, configContent, "utf8");
  }

  console.log("\n=== Import-Zusammenfassung ===");
  console.log(`Verarbeitete Links: ${links.length}`);
  console.log(`Erfolgreich gespeichert: ${successes.length}`);
  console.log(`Fehlgeschlagen: ${failures.length}`);

  if (successes.length > 0) {
    console.log("\nErzeugte Dateien:");
    successes.forEach((item) => console.log(`- ${item.file}`));
    console.log("\nWebsite-Config aktualisiert: src/config/importedImages.ts");
  }

  if (failures.length > 0) {
    console.log("\nFehlgeschlagene Links:");
    failures.forEach((item) => console.log(`- ${item.link} -> ${item.reason}`));
  }

  process.exit(successes.length > 0 ? 0 : 1);
}

run();
