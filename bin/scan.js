#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
function flat(o, p, out) {
  out = out || {};
  if (o && typeof o === 'object' && !Array.isArray(o)) {
    for (const k of Object.keys(o)) flat(o[k], p ? p + '.' + k : k, out);
  } else if (p) out[p] = o;
  return out;
}
const dir = process.argv[2];
const base = (process.argv.includes('--base') ? process.argv[process.argv.indexOf('--base') + 1] : 'en') + '.json';
if (!dir) {
  console.error('Usage: i18n-gap <dir> [--base en]');
  process.exit(1);
}
const basePath = path.join(dir, base);
const baseKeys = flat(JSON.parse(fs.readFileSync(basePath, 'utf8')));
let gaps = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json') && x !== base)) {
  const keys = flat(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  const miss = Object.keys(baseKeys).filter((k) => !(k in keys));
  console.log(f, 'missing', miss.length);
  miss.forEach((k) => console.log(' -', k));
  gaps += miss.length;
}
process.exit(gaps ? 1 : 0);
