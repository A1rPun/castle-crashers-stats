export default (resistance, damage) => {
  return damage * (1 - (resistance * -1) / 100);
};
