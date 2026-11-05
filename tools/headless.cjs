#!/usr/bin/env node
/*
 * Banc d'essai sans navigateur pour Stand Errant.
 * Charge le script de index.html avec des bouchons (DOM, WebGPU, Web Audio), puis joue des parties
 * automatiques sur chaque carte avec chaque Stand jouable, en appelant la vraie boucle frame().
 *
 *   node tools/headless.cjs                         toutes les cartes × tous les Stands jouables, 30 s chacun
 *   node tools/headless.cjs --maps manor,chess      seulement ces cartes (id de MAPS)
 *   node tools/headless.cjs --stands chrono,horloge seulement ces Stands (id de STANDS)
 *   node tools/headless.cjs --seconds 10            durée simulée par partie
 *   node tools/headless.cjs --wgsl /tmp/s.wgsl --seconds 0   écrit le shader WGSL généré (pour naga) sans simuler
 *   HEADLESS_SCENARIO=/chemin/test.js node tools/headless.cjs   exécute un scénario personnalisé (même portée que le jeu)
 *
 * Code de sortie : 0 si tout va bien, 1 si un personnage reste coincé dans un obstacle, 2 si une erreur JS survient.
 */
const fs = require('fs'), path = require('path');
const opt = { seconds: 30, maps: null, stands: null, wgsl: null, quiet: false };
const a = process.argv.slice(2);
for (let i = 0; i < a.length; i++) {
  if (a[i] === '--seconds') opt.seconds = +a[++i];
  else if (a[i] === '--maps') opt.maps = a[++i].split(',');
  else if (a[i] === '--stands') opt.stands = a[++i].split(',');
  else if (a[i] === '--wgsl') opt.wgsl = a[++i];
  else if (a[i] === '--quiet') opt.quiet = true;
  else { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(0); }
}
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error('Script introuvable dans index.html'); process.exit(2); }
const scenario = fs.readFileSync(process.env.HEADLESS_SCENARIO || path.join(__dirname, 'headless-scenario.js'), 'utf8');

/* ---- bouchons ---- */
const mk = () => new Proxy(function () {}, {
  get: (t, k) => {
    if (k === 'style') return { setProperty() {}, transform: '' };
    if (k === 'classList') return { add() {}, remove() {} };
    if (k === 'getContext') return () => mk();
    if (k === 'getBoundingClientRect') return () => ({ left: 0, top: 0, width: 100, height: 100 });
    if (k === 'children') return [mk(), mk(), mk()];
    if (k === 'measureText') return () => ({ width: 50 });
    if (k === 'clientWidth') return 150;
    if (k === 'then') return undefined;
    if (k === Symbol.toPrimitive) return () => 0;
    if (k === 'value') return '1';
    return mk();
  },
  set: () => true, apply: () => mk(),
});
const node = () => ({
  gain: { value: 1, setTargetAtTime() {}, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} },
  frequency: { value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} },
  Q: { value: 1 }, threshold: { value: 0 }, ratio: { value: 0 }, playbackRate: { value: 1 },
  connect(x) { return x || node(); }, disconnect() {}, start() {}, stop() {}, buffer: null, loop: false, type: '',
});
Object.assign(global, {
  window: global, innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1,
  document: { getElementById: () => mk(), querySelector: () => mk(), querySelectorAll: () => [], createElement: () => mk(), fonts: {} },
  matchMedia: () => ({ matches: false }), addEventListener: () => {}, requestAnimationFrame: () => {},
  localStorage: { getItem: () => null, setItem() {} },
  GPUBufferUsage: {}, GPUShaderStage: {}, indexedDB: undefined,
  fetch: async () => ({ ok: false, json: async () => ({}), arrayBuffer: async () => new ArrayBuffer(0) }),
  __mk: mk, __audioNode: node, __opt: opt, __fs: fs,
});
for (const [k, v] of [['navigator', {}]]) Object.defineProperty(global, k, { value: v, configurable: true, writable: true });
const realErr = console.error;
console.error = (...x) => { if (x[0] && x[0].message === 'nogpu') return; realErr(...x); };
eval(m[1] + '\n;' + scenario);
