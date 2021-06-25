'use strict';
import enemies from '../assets/enemies.js';
import calculateHits from './calculateHits.js';

function formatHits(x, strength, normal, numPlayers) {
  let health = x.NormalHealth;
  const multiplier = x.InsaneMultiplier ?? 10;

  if (!normal) health *= multiplier;

  if (numPlayers > 1)
    health +=
      (normal ? x.PerPlayerHealthIncrease ?? 0 : (x.PerPlayerHealthIncrease ?? 0) * multiplier) *
      (numPlayers - 1);

  return x.oneDamagePerHit ? health : calculateHits(health, x.Physical ?? 0, strength);
}

export default function (strength, normal, numPlayers) {
  return Object.entries(enemies)
    .filter(([, x]) => x.NormalHealth)
    .map(([name, x]) => {
      const hits = formatHits(x, strength, normal, numPlayers);
      return `${name} in ${Math.ceil(hits)} hits`;
    })
    .join('\n');
}
