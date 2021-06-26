import calculateDamage from './calculateDamage.js';

export default (health, resistance, damage) => {
  return health / calculateDamage(resistance, damage);
};
