#!/usr/bin/env node
/*
 * Produit la version « artefact claude.ai » de index.html : le corps de page sans <!doctype>, <html>, <head>, <body>
 * (l'outil Artifact ajoute lui-même ce squelette).
 *   node tools/to-artifact.cjs /chemin/sortie.html
 */
const fs = require('fs'), path = require('path');
const out = process.argv[2];
if (!out) { console.error('Usage : node tools/to-artifact.cjs /chemin/sortie.html'); process.exit(1); }
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const head = html.slice(html.indexOf('<title>'), html.indexOf('</head>'));
const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));
fs.writeFileSync(out, head.trimEnd() + '\n' + body.trim() + '\n');
console.log('Écrit : ' + out);
