import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

const CONTENT_ROOT = path.join(process.cwd(), "pages-content");
const PUBLIC_DIR = path.join(CONTENT_ROOT, "public");
const PROTECTED_DIR = path.join(CONTENT_ROOT, "protected");

export type PageVisibility = "public" | "protected";

export type ResolvedPage = {
  slug: string;
  visibility: PageVisibility;
  filePath: string;
};

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export async function listPublicPages(): Promise<string[]> {
  return listSlugs(PUBLIC_DIR);
}

export async function resolveSlug(slug: string): Promise<ResolvedPage | null> {
  if (!isValidSlug(slug)) return null;

  const publicPath = path.join(PUBLIC_DIR, `${slug}.html`);
  if (await fileExists(publicPath)) {
    return { slug, visibility: "public", filePath: publicPath };
  }

  const protectedPath = path.join(PROTECTED_DIR, `${slug}.html`);
  if (await fileExists(protectedPath)) {
    return { slug, visibility: "protected", filePath: protectedPath };
  }

  return null;
}

export async function readPage(page: ResolvedPage): Promise<string> {
  return readFile(page.filePath, "utf8");
}

async function listSlugs(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir);
    return entries
      .filter((name) => name.endsWith(".html"))
      .map((name) => name.slice(0, -".html".length))
      .filter(isValidSlug)
      .sort();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const s = await stat(filePath);
    return s.isFile();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw err;
  }
}
