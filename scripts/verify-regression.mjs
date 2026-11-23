// node scripts/verify-regression.mjs <QA node_modules> [URL local]
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { qaURL } from './qa-browser.mjs';

assert.ok(process.argv[2], 'Indicar la carpeta node_modules de las herramientas QA existentes');
const scripts = [
  'verify-static.mjs',
  'verify.mjs', 'verify-header.mjs', 'verify-web3forms.mjs',
  'verify-form.mjs', 'verify-contact.mjs', 'verify-seo-local.mjs',
  'verify-calculator.mjs', 'verify-projects.mjs', 'verify-project-links.mjs',
  'verify-service-links.mjs', 'verify-services-bento.mjs',
  'verify-services-glow.mjs', 'verify-projected-links.mjs', 'verify-cinematic.mjs',
];
const results = [];
const output = '.impeccable/review/phase3';
await mkdir(output, { recursive: true });
for (const script of scripts) {
  const result = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [`scripts/${script}`, process.argv[2], qaURL], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => resolve({ script, code, stdout, stderr }));
  });
  results.push(result);
  console.log(`${result.code === 0 ? 'PASS' : 'FAIL'} ${script}`);
  if (result.code !== 0) console.error(result.stderr || result.stdout);
}
await writeFile(`${output}/regression.json`, JSON.stringify(results, null, 2));
assert.ok(results.every(result => result.code === 0), 'Hay regresiones pendientes; consultar regression.json');
