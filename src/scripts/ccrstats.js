'use strict';
import enemies from '../assets/enemies.js';
import calculateHits from './calculateHits.js';

function formatHits(strength, health, x) {
  return x.oneDamagePerHit
    ? x[health]
    : calculateHits(x[health], x.Physical ?? 0, strength);
}

export default function (strength, normal) {
  return Object.entries(enemies)
    .filter(([, x]) => x.NormalHealth && x.InsaneHealth)
    .map(([name, x]) => {
      const hits = formatHits(
        strength,
        normal ? 'NormalHealth' : 'InsaneHealth',
        x
      );
      return `${name} in ${Math.ceil(hits)} hits`;
    })
    .join('\n');
}
