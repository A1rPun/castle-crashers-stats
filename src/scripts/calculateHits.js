export default (health, resistance, damage) => {
  return health / (damage * (1 - (resistance * -1) / 100));
};
