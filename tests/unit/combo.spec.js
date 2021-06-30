// import { shallowMount } from '@vue/test-utils';
import parseCombo from '../../src/scripts/parseCombo.js';

function toNum(combo) {
  return combo.reduce((prev, cur) => prev + cur, 0);
}

function testCombo(combo) {
  return toNum(parseCombo(combo, 20, 25, 27, 30, 15, 50, 10))
}

/*
<h3>Unlocked melee combo's</h3>
<div>Throw</div>
<div>Stomp</div>
<div v-if="mode === 3 || level >= 2">Spin attack</div>
<div v-if="mode === 3 || level >= 4">Sprint attack</div>
<div v-if="mode === 3 || level >= 8">Uppercut</div>
<div v-if="mode === 3 || level >= 16">Headbutt</div>
<div v-if="mode === 3 || level >= 32">Slashing Headbutt</div>
<div v-if="mode === 3 || (level >= 50 && magic >= 15)">Drill</div>
<h3>Unlocked magic combo's</h3>
<div>Splash magic</div>
<div v-if="mode === 3 || magic >= 5">Projectile magic</div>
<div v-if="mode === 3 || magic >= 10">Air Projectile magic</div>
<div v-if="mode === 3 || magic >= 15">Elemental Infusion</div>
<div v-if="mode === 3 || magic >= 20">Magic jump</div>
*/

describe('parseCombo.js', () => {
  it('Parses light attack', () => {
    expect(testCombo('x')).toBe(20);
    expect(testCombo('l')).toBe(20);
  });

  it('Parses heavy attack', () => {
    expect(testCombo('y')).toBe(25);
    expect(testCombo('h')).toBe(25);
  });

  it('Parses arrow', () => {
    expect(testCombo('b')).toBe(10);
    expect(testCombo('u')).toBe(10);
  });

  it('Parses jump', () => {
    expect(testCombo('a')).toBe(0);
    expect(testCombo('j')).toBe(0);
  });

  it('Parses magic', () => {
    expect(testCombo('rt')).toBe(0);
    expect(testCombo('m')).toBe(0);
  });

  it('Parses sword spin', () => {
    expect(testCombo('yy')).toBe(65);
    expect(testCombo('hh')).toBe(65);
  });

  it('Parses jumping sword spin', () => {
    expect(testCombo('a yy')).toBe(60);
    expect(testCombo('j hh')).toBe(60);
  });

  it('Parses splash magic', () => {
    expect(testCombo('rty')).toBe(15);
    expect(testCombo('mh')).toBe(15);
  });

  it('Parses projectile magic', () => {
    expect(testCombo('rtb')).toBe(30);
    expect(testCombo('mu')).toBe(30);
    expect(testCombo('a rty')).toBe(30);
    expect(testCombo('j mh')).toBe(30);
  });

  it('Parses magic jump', () => {
    expect(testCombo('rta')).toBe(30);
    expect(testCombo('mj')).toBe(30);
  });

  it('Parses spin attack', () => {
    expect(testCombo('aa')).toBe(5);
    expect(testCombo('jj')).toBe(5);
  });

  it('Parses uppercut', () => {
    expect(testCombo('xy')).toBe(40);
    expect(testCombo('lh')).toBe(40);
  });

  it('Parses headbutt', () => {
    expect(testCombo('xxy')).toBe(65);
    expect(testCombo('llh')).toBe(65);
  });

  it('Parses slashing headbutt', () => {
    expect(testCombo('xxyy')).toBe(105);
    expect(testCombo('llhh')).toBe(105);
  });

  it('Parses elemental infusion', () => {
    expect(testCombo('xxxy')).toBe(110);
    expect(testCombo('lllh')).toBe(110);
  });

  it('Parses drill', () => {
    expect(testCombo('xxxyy')).toBe(137);
    expect(testCombo('lllhh')).toBe(137);
  });

  it('Parses ground combo', () => {
    expect(testCombo('xxxxxx')).toBe(120);
  });

  it('Parses air combo', () => {
    expect(testCombo('a xxxxxx')).toBe(120);
  });

  it('Parses arena combo', () => {
    expect(testCombo('RTA XYY XYY XY XYY XY XY XY')).toBe(430);
  });
});
