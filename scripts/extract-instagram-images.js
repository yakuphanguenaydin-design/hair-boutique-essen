#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, "public", "instagram-imports");
const OUTPUT_JSON_PATH = path.join(ROOT_DIR, "src", "data", "instagram-extracted-images.json");
const IMPORTED_CONFIG_PATH = path.join(ROOT_DIR, "src", "config", "importedImages.ts");

const POST_URLS = [
  "https://www.instagram.com/p/DV4BQL8DDR5/",
  "https://www.instagram.com/p/DVofjmejNLR/",
  "https://www.instagram.com/p/DVJrlqsjJA2/",
  "https://www.instagram.com/p/DUqq8VEjErn/?img_index=1",
  "https://www.instagram.com/p/DUlWfLjDEU0/",
  "https://www.instagram.com/p/DT0rVa6jHBj/",
  "https://www.instagram.com/p/DOY8YQfCFmk/",
];

const CONTENT_TYPE_EXTENSION_MAP = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

const IMAGE_HEADERS = {
  "User-Agent": "Mozilla/5.0",
  Accept: "image/*,*/*;q=0.8",
  Referer: "https://www.instagram.com/",
};

const MAX_ATTEMPTS = 3;

const IMAGE_ASSIGNMENTS = {
  hero: "DVofjmejNLR",
  services: ["DV4BQL8DDR5", "DVJrlqsjJA2"],
  gallery: ["DUlWfLjDEU0", "DUqq8VEjErn", "DT0rVa6jHBj"],
  about: "DOY8YQfCFmk",
};

function normalizePostUrl(rawUrl) {
  const url = new URL(rawUrl);
  url.search = "";
  url.hash = "";
  const segments = url.pathname.split("/").filter(Boolean);
  const postId = segments[1] ?? "";
  url.pathname = postId ? `/p/${postId}/` : url.pathname;
  return url.toString();
}

function extractPostId(rawUrl) {
  const url = new URL(rawUrl);
  const segments = url.pathname.split("/").filter(Boolean);
  const typeIndex = segments.findIndex((segment) => segment === "p");
  if (typeIndex === -1 || !segments[typeIndex + 1]) {
    throw new Error(`Kein gueltiger Instagram-Post-Link: ${rawUrl}`);
  }

  return segments[typeIndex + 1];
}

function buildMediaUrl(postId) {
  return `https://www.instagram.com/p/${postId}/media?size=l`;
}

function getExtensionFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    return ext || "";
  } catch {
    return "";
  }
}

function resolveFileExtension(contentType, finalUrl) {
  const mimeType = (contentType ?? "").split(";")[0].trim().toLowerCase();
  if (CONTENT_TYPE_EXTENSION_MAP[mimeType]) {
    return CONTENT_TYPE_EXTENSION_MAP[mimeType];
  }

  const urlExtension = getExtensionFromUrl(finalUrl);
  return urlExtension || ".jpg";
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function buildImportedImagesConfig(records) {
  const recordById = new Map(records.map((record) => [record.postId, record]));
  const hero = recordById.get(IMAGE_ASSIGNMENTS.hero)?.localPath ?? "";
  const services = IMAGE_ASSIGNMENTS.services
    .map((postId) => recordById.get(postId)?.localPath ?? "")
    .filter(Boolean);
  const gallery = IMAGE_ASSIGNMENTS.gallery
    .map((postId) => recordById.get(postId)?.localPath ?? "")
    .filter(Boolean);
  const about = recordById.get(IMAGE_ASSIGNMENTS.about)?.localPath ?? "";

  return `export type ImportedImagesConfig = {
  enabled: boolean;
  slug: string;
  hero: string;
  services: string[];
  gallery: string[];
  about: string;
};

export const importedImagesConfig: ImportedImagesConfig = {
  enabled: ${records.length > 0 ? "true" : "false"},
  slug: "instagram-extracted-images",
  hero: ${JSON.stringify(hero)},
  services: ${JSON.stringify(services, null, 2)},
  gallery: ${JSON.stringify(gallery, null, 2)},
  about: ${JSON.stringify(about)},
};
`;
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readExistingRecords() {
  try {
    const raw = await fs.readFile(OUTPUT_JSON_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function fetchWithRetries(url, options) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw lastError;
}

async function downloadImage({ postUrl, postId, mediaUrl, existingRecord }) {
  const response = await fetchWithRetries(mediaUrl, {
    method: "GET",
    redirect: "follow",
    headers: IMAGE_HEADERS,
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("image/")) {
    throw new Error(`Ungueltiger Content-Type: ${contentType || "unknown"}`);
  }

  const finalImageUrl = response.url;
  const extension = resolveFileExtension(contentType, finalImageUrl);
  const fileName = `${postId}${extension}`;
  const absoluteFilePath = path.join(OUTPUT_DIR, fileName);
  const localPath = `/instagram-imports/${fileName}`;

  const imageBuffer = Buffer.from(await response.arrayBuffer());

  let shouldWriteFile = true;
  if (existingRecord?.localPath === localPath) {
    try {
      await fs.access(absoluteFilePath);
      shouldWriteFile = existingRecord.finalImageUrl !== finalImageUrl;
    } catch {
      shouldWriteFile = true;
    }
  }

  if (shouldWriteFile) {
    await fs.writeFile(absoluteFilePath, imageBuffer);
  }

  return {
    postUrl,
    postId,
    mediaUrl,
    finalImageUrl,
    localPath,
    skippedDownload: !shouldWriteFile,
  };
}

async function run() {
  await ensureDirectory(OUTPUT_DIR);
  await ensureDirectory(path.dirname(OUTPUT_JSON_PATH));

  const existingRecords = await readExistingRecords();
  const existingRecordById = new Map(existingRecords.map((record) => [record.postId, record]));

  const successes = [];
  const failures = [];

  for (const rawPostUrl of POST_URLS) {
    const postUrl = normalizePostUrl(rawPostUrl);

    try {
      const postId = extractPostId(postUrl);
      const mediaUrl = buildMediaUrl(postId);
      const record = await downloadImage({
        postUrl,
        postId,
        mediaUrl,
        existingRecord: existingRecordById.get(postId),
      });

      successes.push({
        postUrl: record.postUrl,
        postId: record.postId,
        mediaUrl: record.mediaUrl,
        finalImageUrl: record.finalImageUrl,
        localPath: record.localPath,
      });

      console.log(
        `${record.skippedDownload ? "SKIP" : "OK"} ${record.postId} -> ${record.localPath} -> ${record.finalImageUrl}`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unbekannter Fehler";
      failures.push({ postUrl, reason: message });
      console.error(`ERROR ${postUrl} -> ${message}`);
    }
  }

  await fs.writeFile(OUTPUT_JSON_PATH, `${JSON.stringify(successes, null, 2)}\n`, "utf8");
  await fs.writeFile(IMPORTED_CONFIG_PATH, buildImportedImagesConfig(successes), "utf8");

  console.log("\n=== Extraktions-Zusammenfassung ===");
  console.log(`Erfolgreich extrahiert: ${successes.length}`);
  console.log(`Fehlgeschlagen: ${failures.length}`);

  if (successes.length > 0) {
    console.log("\nGespeicherte Dateien:");
    successes.forEach((record) => console.log(`- ${toPosixPath(path.join("public", record.localPath.replace(/^\//, "")))}`));
  }

  if (failures.length > 0) {
    console.log("\nFehlgeschlagene Links:");
    failures.forEach((failure) => console.log(`- ${failure.postUrl} -> ${failure.reason}`));
  }

  process.exit(failures.length > 0 ? 1 : 0);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});