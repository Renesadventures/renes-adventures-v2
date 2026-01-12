import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');
const targetDir = path.join(publicDir, 'images', 'renes-activities');
const outFile = path.join(projectRoot, 'src', 'data', 'asset-manifest.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png']);
const VIDEO_EXTS = new Set(['.mp4']);

function toSafeFileName(fileName) {
  return fileName
    .replace(/[\s()]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-\./g, '.')
    .replace(/^\-+/, '')
    .replace(/\-+$/, '');
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }

  return files;
}

function toPublicPath(absPath) {
  const rel = path.relative(publicDir, absPath);
  return `/${rel.split(path.sep).join('/')}`;
}

async function renameToSafe(absPath) {
  const dir = path.dirname(absPath);
  const ext = path.extname(absPath);
  const base = path.basename(absPath, ext);
  const safeBase = toSafeFileName(base);
  const safeName = `${safeBase}${ext}`;

  if (safeName === path.basename(absPath)) return absPath;

  let candidate = path.join(dir, safeName);
  let counter = 1;
  while (true) {
    try {
      await fs.access(candidate);
      const next = `${safeBase}-${counter}${ext}`;
      candidate = path.join(dir, next);
      counter += 1;
    } catch {
      break;
    }
  }

  await fs.rename(absPath, candidate);
  return candidate;
}

async function main() {
  let files = [];
  try {
    files = await walk(targetDir);
  } catch {
    files = [];
  }

  const renamedFiles = [];
  for (const f of files) {
    // Rename only if needed; keeps behavior stable otherwise.
    renamedFiles.push(await renameToSafe(f));
  }

  const images = [];
  const videos = [];

  for (const f of renamedFiles) {
    const ext = path.extname(f).toLowerCase();
    if (IMAGE_EXTS.has(ext)) images.push(toPublicPath(f));
    if (VIDEO_EXTS.has(ext)) videos.push(toPublicPath(f));
  }

  images.sort();
  videos.sort();

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: '/public/images/renes-activities',
    images,
    videos,
  };

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${outFile} (images: ${images.length}, videos: ${videos.length})`);
}

await main();
