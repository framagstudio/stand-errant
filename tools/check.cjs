#!/usr/bin/env node
/*
 * Vérification complète avant un push :
 *   1. le script de index.html compile (erreur de syntaxe avec numéro de ligne) ;
 *   2. le shader WGSL généré est valide (avec naga si installé : `cargo install naga-cli`) ;
 *   3. une partie automatique courte tourne sur chaque carte avec chaque Stand jouable.
 *
 *   node tools/check.cjs            vérification complète (10 s simulées par partie)
 *   node tools/check.cjs --fast     syntaxe + shader seulement
 */
const fs = require('fs'), path = require('path'), os = require('os'), vm = require('vm'), cp = require('child_process');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
const scriptLine = html.slice(0, html.indexOf('<script>')).split('\n').length;
let ok = true;
try { new vm.Script(m[1], { filename: 'index.html' }); console.log('✓ Syntaxe JavaScript'); }
catch (e) {
  ok = false; const ln = /index\.html:(\d+)/.exec(e.stack || '');
  console.error('✗ Syntaxe JavaScript : ' + e.message + (ln ? ` (vers la ligne ${+ln[1] + scriptLine - 1} de index.html)` : ''));
  process.exit(1);
}
const wgsl = path.join(os.tmpdir(), 'stand-errant.wgsl');
const r = cp.spawnSync(process.execPath, [path.join(__dirname, 'headless.cjs'), '--wgsl', wgsl, '--seconds', '0'], { encoding: 'utf8' });
if (r.status !== 0) { console.error('✗ Génération du shader\n' + r.stdout + r.stderr); process.exit(1); }
const naga = ['naga', path.join(os.homedir(), '.cargo', 'bin', 'naga')].find(c => cp.spawnSync(c, ['--version']).status === 0);
if (naga) {
  const v = cp.spawnSync(naga, [wgsl], { encoding: 'utf8' });
  if (v.status === 0) console.log('✓ Shader WGSL valide (naga)'); else { ok = false; console.error('✗ Shader WGSL invalide :\n' + v.stdout + v.stderr); }
} else console.log('• naga absent : shader non validé (installer avec `cargo install naga-cli`). WGSL écrit dans ' + wgsl);
if (!process.argv.includes('--fast')) {
  const s = cp.spawnSync(process.execPath, [path.join(__dirname, 'headless.cjs'), '--seconds', '10', '--quiet'], { encoding: 'utf8', stdio: 'inherit' });
  if (s.status !== 0) ok = false;
}
process.exit(ok ? 0 : 1);
