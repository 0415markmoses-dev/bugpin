import { dirname, relative, resolve, sep } from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const declarationRoot = resolve(__dirname, '../dist');
const declarationFiles = await Array.fromAsync(
  new Bun.Glob('**/*.d.ts').scan({ cwd: declarationRoot, absolute: true })
);

let rewrittenImportCount = 0;

for (const filePath of declarationFiles) {
  const content = await Bun.file(filePath).text();
  const rewritten = content.replace(
    /(['"])@shared\/([^'"]+)\1/g,
    (_match: string, quote: string, modulePath: string) => {
      const targetPath = resolve(declarationRoot, 'shared', `${modulePath}.js`);
      const relativePath = relative(dirname(filePath), targetPath).split(sep).join('/');
      const specifier = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
      rewrittenImportCount += 1;
      return `${quote}${specifier}${quote}`;
    }
  );

  if (/['"]@shared\//.test(rewritten)) {
    throw new Error(`Unresolved declaration alias in ${filePath}`);
  }

  if (rewritten !== content) {
    await Bun.write(filePath, rewritten);
  }
}

console.info(`Rewrote ${rewrittenImportCount} declaration alias imports.`);
