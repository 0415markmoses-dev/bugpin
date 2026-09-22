import { describe, expect, it } from 'vitest';
import { getDirname, getFilename } from '../../src/server/runtime.js';

describe('runtime compatibility', () => {
  it('resolves import-meta paths without Bun-only globals', () => {
    const dir = getDirname(import.meta.url);
    const file = getFilename(import.meta.url);

    expect(dir).toBeTruthy();
    expect(file).toContain('runtime-compat.test.ts');
  });
});
