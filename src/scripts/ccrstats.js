'use strict';
import enemies from '../assets/enemies.js';
import calculateHits from './calculateHits.js';

function formatHits(strength, normal, x) {
  const health = normal
    ? x.NormalHealth
    : x.InsaneMultiplier
    ? x.NormalHealth * x.InsaneMultiplier
    : x.NormalHealth * 10;
  return x.oneDamagePerHit ? health : calculateHits(health, x.Physical ?? 0, strength);
}

export default function (strength, normal) {
  return Object.entries(enemies)
    .filter(([, x]) => x.NormalHealth)
    .map(([name, x]) => {
      const hits = formatHits(strength, normal, x);
      return `${name} in ${Math.ceil(hits)} hits`;
    })
    .join('\n');
}
