export function health(level, defense) {
  return 69 + defense * 28 + level * 3;
}

export function resistance(defense) {
  return 40 + defense / 2;
}
