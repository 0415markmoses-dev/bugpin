import { fileURLToPath } from 'node:url';

export function getDirname(metaUrl: string | URL): string {
  return fileURLToPath(new URL('.', metaUrl));
}

export function getFilename(metaUrl: string | URL): string {
  return fileURLToPath(metaUrl);
}

export function isBunRuntime(): boolean {
  return typeof Bun !== 'undefined';
}
