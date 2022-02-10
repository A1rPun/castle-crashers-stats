function clampAgility(agility) {
  return Math.min(agility, 25);
}

// Check arrowDamage in code
export function arrowDamage(agility) {
  return Math.floor(2 + clampAgility(agility));
}

export function arrowXSpeed(agility) {
  return {
    x: 21 + clampAgility(agility) * 1.15,
    y: -5,
  };
}

export function speed(agility, isArena = false) {
  agility = clampAgility(agility);
  const x = isArena ? agility / 8 + 4.875 : agility / 10 + 4.5;
  const y = isArena ? x - 1.5 : x * 0.6;
  return { x, y };
}
