<template>
  <div class="container">
    <div class="input">
      <h1>Castle Crashers Remastered</h1>
      <!-- <div class="game">
        <h3>Game</h3>
        <label>
          <span>Castle Crashers Remastered</span>
          <input type="radio" v-model="OG" :value="false" checked @change="updateStats" />
        </label>
        <label>
          <s>Castle Crashers</s>
          <input type="radio" v-model="OG" :value="true" @change="updateStats" disabled />
        </label>
      </div> -->
      <div class="modes">
        <h3>Mode</h3>
        <label>
          <span>Normal</span>
          <input type="radio" v-model="mode" :value="1" @change="updateStats" />
        </label>
        <label>
          <span>Insane</span>
          <input type="radio" v-model="mode" :value="2" @change="updateStats" />
        </label>
        <label>
          <span>Arena</span>
          <input type="radio" v-model="mode" :value="3" @change="updateStats" />
        </label>
      </div>
      <div class="players" v-if="this.mode < 3">
        <h3>Number of players</h3>
        <label>
          <span>1p</span>
          <input type="radio" v-model="numPlayers" :value="1" @change="updateStats" />
        </label>
        <label>
          <span>2p</span>
          <input type="radio" v-model="numPlayers" :value="2" @change="updateStats" />
        </label>
        <label>
          <span>3p</span>
          <input type="radio" v-model="numPlayers" :value="3" @change="updateStats" />
        </label>
        <label>
          <span>4p</span>
          <input type="radio" v-model="numPlayers" :value="4" @change="updateStats" />
        </label>
      </div>
      <div class="stats" v-if="this.mode < 3">
        <h3>Stats</h3>
        <label>
          <span>Level</span>
          <div>
            <input
              type="number"
              v-model.number="level"
              value="99"
              min="1"
              max="99"
              @change="updateStats"
            />
          </div>
        </label>
        <label>
          <span>Strength</span>
          <StatBar v-model="strength" @change="updateStats"></StatBar>
        </label>
        <label>
          <span>Magic</span>
          <StatBar v-model="magic" @change="updateStats"></StatBar>
        </label>
        <label>
          <span>Defense</span>
          <StatBar v-model="defense" @change="updateStats"></StatBar>
        </label>
        <label>
          <span>Agility</span>
          <StatBar v-model="agility" @change="updateStats"></StatBar>
        </label>
      </div>
      <div>
        <h3>Weapon</h3>
        <select v-model="weapon" @change="updateStats">
          <option v-for="w in weapons" :value="w" :key="w.name">
            {{ w.name }}
          </option>
        </select>
        <span v-if="weapon.strength">strength:{{ weapon.strength }}</span>
        <span v-if="weapon.magic">magic:{{ weapon.magic }}</span>
        <span v-if="weapon.defense">defense:{{ weapon.defense }}</span>
        <span v-if="weapon.agility">agility:{{ weapon.agility }}</span>
        <span v-if="weapon.crit">crit:{{ weapon.crit }}%</span>
        <div v-if="weapon.crit !== undefined">
          <label>
            <input type="checkbox" v-model="doCrit" @change="updateStats" />
            <span>Enemy gets hit with 100% critical strikes</span>
          </label>
        </div>
      </div>
      <div>
        <h3>Pet</h3>
        <select v-model="pet" @change="updateStats">
          <option v-for="p in pets" :value="p" :key="p.name">
            {{ p.name }}
          </option>
        </select>
        <span v-if="pet.strength">strength:{{ pet.strength }}</span>
        <span v-if="pet.magic">magic:{{ pet.magic }}</span>
        <span v-if="pet.defense">defense:{{ pet.defense }}</span>
        <span v-if="pet.agility">agility:{{ pet.agility }}</span>
      </div>
      <div>
        <h3>Combo (🧪 experimental)</h3>
        <div>
          <input type="text" v-model="combo" @change="updateStats" />
          <pre>
x  l = light attack
y  h = heavy attack
a  j = jump
b  u = use item (arrow)
rt m = magic</pre
          >
        </div>
      </div>
    </div>
    <div class="output">
      <div v-if="this.mode < 3">
        <div v-if="(weapon.level || 1) > level">
          {{ weapon.name }} has a level requirement of {{ weapon.level }}
        </div>
        <div v-if="spendStatPoints < totalStatPoints">
          {{ totalStatPoints - spendStatPoints }} unspend stat points based on level {{ level }} ({{
            totalStatPoints
          }}
          points)
        </div>
        <div v-if="spendStatPoints > totalStatPoints">
          spend {{ spendStatPoints - totalStatPoints }} stat points too much based on level
          {{ level }} ({{ totalStatPoints }} points)
        </div>
      </div>
      <h3>Stats total</h3>
      <div v-if="this.mode < 3">Exp: {{ experience }}</div>
      <div v-else>Level: 30</div>
      <div>Strength: {{ totalStrength }}</div>
      <div>Magic: {{ totalMagic }}</div>
      <div>Defense: {{ totalDefense }}</div>
      <div>Agility: {{ totalAgility }}</div>
      <h3>Damage</h3>
      <div>Base attack damage: {{ normalDamage }}</div>
      <div>Base heavy attack damage: {{ heavyDamage }}</div>
      <div>Base throw damage: {{ throwDamage }}</div>
      <div>Base magic damage (projectile/jump): {{ magicDamage }}</div>
      <div>Splash magic damage: {{ splashDamage }}</div>
      <div v-if="magic >= 15">
        Elemental infusion damage: {{ infusionDamage }} or {{ infusionDamage * 2 }} piercing
      </div>
      <div>Arrow damage: {{ arrowDamage }}</div>
      <div v-if="this.mode < 3">Bomb damage: {{ bombDamage }}</div>
      <div>🧪 Combo damage: {{ comboDamage.reduce((prev, cur) => prev + cur) }}</div>
      <h3>Defense</h3>
      <div>Health: {{ health }}</div>
      <div>Resistance: {{ resistance }}</div>
      <div>Damage taken: {{ damageTaken }}%</div>
      <div>Run speed: x{{ runSpeed }}</div>
      <h3>Enemy hits</h3>
      <div class="CCR">{{ output }}</div>
      <div class="CC"></div>
    </div>
  </div>
</template>

<script>
import StatBar from './components/StatBar';
import ccrstats from './scripts/ccrstats.js';
import basestats from './assets/basestats.js';
import weapons from './assets/weapons.js';
import pets from './assets/pets.js';
import calculateHits from './scripts/calculateHits.js';
import calculateDamage from './scripts/calculateDamage.js';
import parseCombo from './scripts/parseCombo.js';

export default {
  name: 'CCStats',
  components: {
    StatBar,
  },
  computed: {
    extraStrength() {
      return (
        (this.weapon.strength ?? 0) +
        (this.pet.strength ?? 0) +
        (this.mode === 3 ? 30 : this.level) * 0.1
      );
    },
    extraMagic() {
      return (this.weapon.magic ?? 0) + (this.pet.magic ?? 0);
    },
    extraDefense() {
      return (this.weapon.defense ?? 0) + (this.pet.defense ?? 0);
    },
    extraAgility() {
      return (this.weapon.agility ?? 0) + (this.pet.agility ?? 0);
    },
    totalStrength() {
      return Math.max(Math.floor((this.mode === 3 ? 20 : this.strength) + this.extraStrength), 1);
    },
    totalMagic() {
      return Math.max(
        Math.floor(
          (this.mode === 3 ? 20 : this.magic) +
            this.extraMagic +
            (this.mode === 3 ? 30 : this.level) * 0.1
        ),
        1
      );
    },
    totalDefense() {
      return Math.max(Math.floor((this.mode === 3 ? 30 : this.defense) + this.extraDefense), 1);
    },
    totalAgility() {
      return Math.max((this.mode === 3 ? 7.5 : this.agility) + this.extraAgility, 1);
    },
    normalAttack() {
      return (this.mode === 3 ? 20 : this.strength) + basestats.normal;
    },
    heavyAttack() {
      return (this.mode === 3 ? 20 : this.strength) * 1.15 + basestats.heavy;
    },
    throwAttack() {
      return (this.mode === 3 ? 20 : this.strength) * 1.2 + basestats.throw;
    },
    magicDamage() {
      return Math.floor(
        Math.max((this.mode === 3 ? 20 : this.magic) + this.extraMagic, 1) * 2 +
          (this.mode === 3 ? 30 : this.level) * 0.1
      );
    },
    splashDamage() {
      return Math.ceil(this.magicDamage * 0.5);
    },
    infusionDamage() {
      return this.normalDamage + this.magicDamage;
    },
    arrowDamage() {
      return 2 + Math.floor(this.totalAgility);
    },
    bombDamage() {
      return (this.magicDamage < this.throwDamage ? this.throwDamage : this.magicDamage) * 2;
    },
    spendStatPoints() {
      return this.strength + this.magic + this.defense + this.agility - 4;
    },
    totalStatPoints() {
      return this.level >= 20 ? 38 + (Math.min(this.level, 78) - 20) : (this.level - 1) * 2;
    },
    health() {
      return this.mode === 3 ? 1000 : 69 + this.level * 3 + this.totalDefense * 28;
    },
    resistance() {
      return 40.5 + 0.5 * (this.totalDefense - 1);
    },
    damageTaken() {
      return Math.round((2 * (1 - this.resistance / 100)).toFixed(2) * 100);
    },
    runSpeed() {
      return Math.min(1 * (1 + this.totalAgility * 0.02), 1.5).toFixed(2);
    },
    experience() {
      return this.level === 1 ? 0 : ((this.level - 1) * ((this.level - 2) * 20 + 380)) / 2 + 1;
    },
  },
  data() {
    return {
      OG: false,
      mode: 1,
      numPlayers: 1,
      level: 8,
      strength: 1,
      magic: 15,
      defense: 1,
      agility: 1,
      combo: 'rta xyy xyy xy xyy xy xy xy',
      weapon: {},
      weapons,
      pet: {},
      pets,
      normalDamage: 0,
      heavyDamage: 0,
      throwDamage: 0,
      comboDamage: 0,
      output: '',
      doCrit: false,
      critMultiplier: 4,
    };
  },
  methods: {
    calcDamage: function (baseAttack) {
      return Math.floor(baseAttack + this.extraStrength) * (this.doCrit ? this.critMultiplier : 1);
    },
    calcArenaHits: function (baseDamage) {
      return Math.round(calculateHits(1000, -10, baseDamage));
    },
    calcArenaDamage: function (baseDamage) {
      return Math.round(calculateDamage(-10, baseDamage));
    },
    updateStats() {
      if (!this.weapon?.crit) this.doCrit = false;
      this.heavyDamage = this.calcDamage(this.heavyAttack);
      this.throwDamage = this.calcDamage(this.throwAttack);
      const damage = this.calcDamage(this.normalAttack);
      this.normalDamage = damage;
      this.comboDamage = parseCombo(
        this.combo,
        this.normalDamage,
        this.heavyDamage,
        this.magicDamage,
        this.splashDamage,
        this.infusionDamage,
        this.arrowDamage
      );
      if (this.mode < 3) this.output = ccrstats(damage, this.mode === 1, this.numPlayers);
      else {
        this.output = `Arena player in ${this.calcArenaHits(this.normalDamage)} hits
${this.calcArenaDamage(this.normalDamage)} normal damage
${this.calcArenaDamage(this.heavyDamage)} heavy damage
${this.calcArenaDamage(this.throwDamage)} throw damage
${Math.floor(calculateDamage(-10, this.splashDamage))} splash magic damage
${this.calcArenaDamage(this.magicDamage)} projectile/jump magic damage
🧪 ${this.comboDamage.reduce((acc, cur) => acc + this.calcArenaDamage(cur), 0)} combo damage with ${this.comboDamage.length} hits`;
      }
    },
  },
  mounted() {
    this.weapon = weapons.find(x => x.name === 'Mace');
    this.pet = pets.find(x => x.name === 'No Pet');
    this.updateStats();
  },
};
</script>

<style>
html,
body {
  margin: 0;
  overflow: hidden;
  font-size: 16px;
}

* {
  cursor: url(assets/NG_Gold_Sword.png), auto;
}

.container {
  display: flex;
}

.input {
  flex: 1;
  padding: 0 32px;
  max-height: 100vh;
  overflow-y: auto;
}

.output {
  flex: 1;
  padding: 0 32px;
  max-height: 100vh;
  overflow-y: auto;
}

.stats {
  display: flex;
  flex-direction: column;
}

.CCR {
  white-space: pre;
}
</style>
