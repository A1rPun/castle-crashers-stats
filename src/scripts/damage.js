export function lightDamage(level, strength) {
  return Math.floor(3 + level * 0.1 + strength);
}

export function heavyDamage(level, strength) {
  return Math.floor(5 + level * 0.1 + strength * 1.15);
}

export function throwDamage(level, strength) {
  return Math.floor(10 + level * 0.1 + strength * 1.2);
}

export function maxDamage(level, strength) {
  return Math.floor(12 + level * 0.1 + strength * 1.25);
}
