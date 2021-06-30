export default (
  combo,
  baseDmg,
  heavyDmg,
  throwDmg,
  baseMagicDmg,
  splashDmg,
  infusionDmg,
  arrowDmg
) => {
  if (!combo.toLowerCase().match(/^x|y|a|b|rt|l|h|j|u|m|\s+$/)) return 0;
  let inAir = false;

  return combo
    .toLowerCase()
    .match(/x|y|a|b|rt|l|h|j|u|m/g)
    .reduce((acc, cur, i, comboArr) => {
      const doMagic = !!i && (comboArr[i - 1] === 'rt' || comboArr[i - 1] === 'm');

      if (cur === 'a' || cur === 'j') {
        if (!inAir && doMagic) acc.push(baseMagicDmg);
        else if (inAir) acc.push(5); // 1 ?
        inAir = true;
      } else if (cur === 'y' || cur === 'h') {
        const doHeavy =
          i === 0 ||
          (i > 1 &&
            (comboArr[i - 1] === 'x' || comboArr[i - 1] === 'l') &&
            (comboArr[i - 2] === 'x' || comboArr[i - 2] === 'l'));
        const doSpin =
          i > 0 &&
          (comboArr[i - 1] === 'y' || comboArr[i - 1] === 'h') &&
          (i < 2 || (comboArr[i - 2] !== 'y' && comboArr[i - 2] !== 'h'));
        const doInfusion =
          !inAir &&
          i > 2 &&
          (comboArr[i - 1] === 'x' || comboArr[i - 1] === 'l') &&
          (comboArr[i - 2] === 'x' || comboArr[i - 2] === 'l') &&
          (comboArr[i - 3] === 'x' || comboArr[i - 3] === 'l');
        const doDrill =
          !inAir &&
          i > 3 &&
          (comboArr[i - 1] === 'y' || comboArr[i - 1] === 'h') &&
          (comboArr[i - 2] === 'x' || comboArr[i - 2] === 'l') &&
          (comboArr[i - 3] === 'x' || comboArr[i - 3] === 'l') &&
          (comboArr[i - 4] === 'x' || comboArr[i - 4] === 'l');

        if (doDrill) acc.push(throwDmg);
        else if (doInfusion) acc.push(infusionDmg);
        else if (doSpin) acc.push(baseDmg, baseDmg);
        else if (inAir) acc.push(doMagic ? baseMagicDmg : baseDmg);
        else acc.push(doMagic ? splashDmg : doHeavy ? heavyDmg : baseDmg);
      } else if (cur === 'b' || cur === 'u') {
        acc.push(doMagic ? baseMagicDmg : arrowDmg);
      } else if (cur === 'x' || cur === 'l') {
        acc.push(baseDmg);
      } else if (cur === 'rt' || cur === 'm') {
      }
      return acc;
    }, []);
};
