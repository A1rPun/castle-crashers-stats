export default (combo, baseDmg, heavyDmg, baseMagicDmg, splashDmg, infusionDmg, arrowDmg) => {
  if (!combo.toLowerCase().match(/^x|y|a|b|rt|l|h|j|u|m|\s+$/)) return 0;
  let inAir = false;
  let doMagic = false;
  let doSpin = false;

  return combo
    .toLowerCase()
    .match(/x|y|a|b|rt|l|h|j|u|m/g)
    .reduce((acc, cur) => {
      switch (cur) {
        case 'a':
        case 'j':
          if (!inAir && doMagic) acc.push(baseMagicDmg);
          else if (inAir) acc.push(5); // 1 ?
          inAir = true;
          doMagic = false;
          doSpin = false;
          return acc;
        case 'y':
        case 'h':
          doSpin
            ? acc.push(baseDmg, baseDmg)
            : acc.push(doMagic ? splashDmg : inAir ? baseDmg : heavyDmg);
          doMagic = false;
          doSpin = true;
          return acc;
        case 'b':
        case 'u':
          acc.push(doMagic ? baseMagicDmg : arrowDmg);
          doMagic = false;
          return acc;
        case 'rt':
        case 'm':
          doMagic = true;
          return acc;
        case 'x':
        case 'l':
        default:
          acc.push(baseDmg);
          doMagic = false;
          doSpin = false;
          return acc;
      }
    }, []);
};
