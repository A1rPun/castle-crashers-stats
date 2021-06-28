'use strict';
import enemies from '../assets/enemies.js';
import calculateHits from './calculateHits.js';

function getHealth(x, numPlayers) {
  let health = x.NormalHealth;
  if (numPlayers > 1) health += (x.PerPlayerHealthIncrease ?? 0) * (numPlayers - 1);
  return health;
}

function getHealthInsane(x, numPlayers) {
  if (x.InsaneHealth) {
    let health = x.InsaneHealth;
    if (numPlayers > 1) health += (x.PerPlayerHealthIncreaseInsane ?? 0) * (numPlayers - 1);
    return health;
  } else {
    let health = x.NormalHealth;
    const multiplier = x.InsaneMultiplier ?? 10;
    health *= multiplier;
    if (numPlayers > 1) health += (x.PerPlayerHealthIncrease ?? 0) * multiplier * (numPlayers - 1);
    return health;
  }
}

export default function (strength, normal, numPlayers) {
  return Object.entries(enemies)
    .filter(([, x]) => x.NormalHealth)
    .map(([name, x]) => {
      const health = normal ? getHealth(x, numPlayers) : getHealthInsane(x, numPlayers);
      const hits = x.oneDamagePerHit ? health : calculateHits(health, x.Physical ?? 0, strength);
      return `${name} ${health}hp in <strong>${Math.ceil(hits)}</strong> hits`;
    })
    .join('\n');
}
