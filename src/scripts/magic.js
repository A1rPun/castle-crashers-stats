export function magic(level, magic) {
  return Math.floor(0.1 * level + 2 * magic);
}

export function magicMax(magic) {
  return 35 + magic * 5;
}

export function magicRegen(magic) {
  return 0.45 + magic * 0.01;
}

export function magicChain(magic) {
  return 1 + Math.floor(0.2 * magic);
}

export function magicSustain(level, magic) {
  return Math.floor(3 + 0.1 * level + magic * 0.4);
}
