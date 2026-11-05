/* Scénario exécuté dans la portée du script du jeu (voir tools/headless.cjs). Il a accès à tout : S, MAPS, STANDS, startGame, frame… */
(async () => {
  const opt = __opt;
  try {
    await new Promise(r => setTimeout(r, 5));
    device = __mk(); gctx = __mk();
    AC = { state: 'running', currentTime: 0, sampleRate: 8000, createGain: __audioNode, createBufferSource: __audioNode, createOscillator: __audioNode,
      createBiquadFilter: __audioNode, createDynamicsCompressor: __audioNode, createBuffer: () => ({ getChannelData: () => new Float32Array(16) }),
      decodeAudioData: async () => ({}), resume() {}, suspend() {}, destination: __audioNode() };
    master = __audioNode(); noiseBuf = {};
    if (opt.wgsl) { __fs.writeFileSync(opt.wgsl, WGSL); console.log('WGSL écrit dans ' + opt.wgsl + ' (' + WGSL.length + ' caractères)'); }
    if (!(opt.seconds > 0)) process.exit(0);
    const maps = opt.maps || MAPS.map(mp => mp.id);
    const stands = opt.stands || [...ENABLED];
    let bad = 0, t = 1000;
    last = t;
    for (const mid of maps) {
      const mi = MAPS.findIndex(mp => mp.id === mid);
      if (mi < 0) { console.error('Carte inconnue : ' + mid); bad++; continue; }
      for (const sid of stands) {
        const si = SI(sid);
        if (si < 0) { console.error('Stand inconnu : ' + sid); bad++; continue; }
        MAPI = mi; startGame(si);
        const p = S.player, N = Math.round(opt.seconds * 60), T0 = Date.now();
        let stuck = 0;
        for (let f = 0; f < N; f++) {
          keys.clear(); joy.x = joy.y = 0;
          let best = null, bd = 1e9;
          for (const e of S.npcs) { if (e.state === 'down') continue; const d = Math.hypot(e.x - p.x, e.y - p.y); if (d < bd) { bd = d; best = e; } }
          if (best && f % 600 < 480) { const dx = best.x - p.x, dy = best.y - p.y, l = Math.hypot(dx, dy) || 1; joy.x = dx / l; joy.y = dy / l; }
          else { joy.x = Math.cos(f / 90); joy.y = Math.sin(f / 70); }
          if (bd < 130) keys.add('KeyJ');
          if (f % 90 === 0) abPressed = true;
          if (f % 150 === 0) tpPressed = true;
          if (f % 300 === 0) for (const tr of trees.slice()) if (PROPS[tr.kind] && Math.random() < .25) propHit(tr);
          t += 1000 / 60; frame(t);
          if (p.dead <= 0 && !p.air && !p.wire && !p.reel && !p.rew && !p.frew && solid(p.x, p.y, 12)) stuck++;
        }
        const ms = (Date.now() - T0) / Math.max(1, N);
        const down = S.npcs.filter(e => e.state === 'down');
        const byNpc = down.filter(e => e.lastBy && e.lastBy !== S.player).length;
        if (!opt.quiet || stuck > 30) console.log(`${mid.padEnd(8)} ${sid.padEnd(13)} ${ms.toFixed(2)} ms/image · hors jeu ${down.length}/${S.npcs.length} (dont ${byNpc} entre ennemis) · images coincé ${stuck}`);
        if (stuck > 30) bad++;
      }
    }
    toMenu();
    console.log(bad ? `Problèmes détectés : ${bad}` : 'Aucun problème détecté.');
    process.exit(bad ? 1 : 0);
  } catch (err) { console.error('ERREUR', err); process.exit(2); }
})();
