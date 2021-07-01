'use strict';
import enemies from '../assets/enemies.js';
import calculateHits from './calculateHits.js';

function getHealth(x, numPlayers) {
  let health = x.NormalHealth;
  if (numPlayers > 1) health += (x.PerPlayerHealthIncrease ?? 0) * (numPlayers - 1);
  return health;
}

function getHealthInsane(x, numPlayers) {
  let health = x.NormalHealth;

  if (x.InsaneHealth) {
    health = x.InsaneHealth;
    if (numPlayers > 1) health += (x.PerPlayerHealthIncreaseInsane ?? 0) * (numPlayers - 1);
  } else {
    const multiplier = x.InsaneMultiplier ?? 10;
    health *= multiplier;
    if (numPlayers > 1) health += (x.PerPlayerHealthIncrease ?? 0) * multiplier * (numPlayers - 1);
  }
  return health;
}

export function formatEnemyHits(name, enemy, strength, normal, numPlayers, critPercent) {
  const health = normal ? getHealth(enemy, numPlayers) : getHealthInsane(enemy, numPlayers);
  let hits = enemy.oneDamagePerHit ? health : calculateHits(health, enemy.Physical ?? 0, strength);
  let criticalHits;

  if (critPercent === 100) {
    hits /= 4;
  } else if (critPercent > 0) {
    criticalHits = Math.round(hits * (critPercent / 100));
    hits -= criticalHits * 3;
  }

  return `${name} ${health}hp in <strong>${Math.ceil(hits)}</strong> ${
    critPercent === 100 ? 'critical ' : ''
  }hits${criticalHits ? ` with ${Math.ceil(criticalHits)} critical` : ''}`;
}

export function formatEnemies(strength, normal, numPlayers, critPercent) {
  return Object.entries(enemies)
    .filter(([, x]) => x.NormalHealth)
    .map(([name, x]) => formatEnemyHits(name, x, strength, normal, numPlayers, critPercent))
    .join('\n');
}

export default { formatEnemies, formatEnemyHits };
