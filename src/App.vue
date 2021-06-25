<template>
  <div class="container">
    <div class="input">
      <div class="game">
        <h3>Game</h3>
        <label>
          <span>Castle Crashers Remastered</span>
          <input type="radio" v-model="OG" :value="false" checked @change="updateStats" />
        </label>
        <label>
          <s>Castle Crashers</s>
          <input type="radio" v-model="OG" :value="true" @change="updateStats" disabled />
        </label>
      </div>
      <div class="modes">
        <h3>Mode</h3>
        <label>
          <span>Normal</span>
          <input type="radio" v-model="isNormal" :value="true" @change="updateStats" />
        </label>
        <label>
          <span>Insane</span>
          <input type="radio" v-model="isNormal" :value="false" @change="updateStats" />
        </label>
        <label>
          <s>Arena</s>
          <input type="radio" @change="updateStats" disabled />
        </label>
      </div>
      <div class="players">
        <h3>Number of players</h3>
        <label>
          <span>1p</span>
          <input type="radio" v-model="numPlayers" :value="1" @change="updateStats" />
        </label>
        <label>
          <s>2p</s>
          <input type="radio" v-model="numPlayers" :value="2" @change="updateStats" disabled />
        </label>
        <label>
          <s>3p</s>
          <input type="radio" v-model="numPlayers" :value="3" @change="updateStats" disabled />
        </label>
        <label>
          <s>4p</s>
          <input type="radio" v-model="numPlayers" :value="4" @change="updateStats" disabled />
        </label>
      </div>
      <div class="stats">
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
        <h3>Combo</h3>
        <div>
          <input type="text" v-model="combo" disabled />
          <pre>
x l = light attack
y h = heavy attack
a j = jump
b u = use item (arrow)</pre
          >
        </div>
      </div>
    </div>
    <div class="output">
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
      <h3>Stats total</h3>
      <div>Strength: {{ totalStrength }}</div>
      <div>Magic: {{ totalMagic }}</div>
      <div>Defense: {{ totalDefense }}</div>
      <div>Agility: {{ totalAgility }}</div>
      <h3>Damage</h3>
      <div class="normalattack">Normal attack damage: {{ normalDamage }}</div>
      <div class="heavyattack">Heavy attack damage: {{ heavyDamage }}</div>
      <div class="heavyattack">Throw damage: {{ throwDamage }}</div>
      <!-- <div class="magicattack">Magic attack damage: {{ magicDamage }}</div> -->
      <!-- {{ comboDamage }} -->
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

export default {
  name: 'CCStats',
  components: {
    StatBar,
  },
  computed: {
    extraStrength() {
      return (this.weapon.strength ?? 0) + (this.pet.strength ?? 0) + this.level * 0.1;
    },
    extraMagic() {
      return (this.weapon.magic ?? 0) + (this.pet.magic ?? 0) + this.level * 0.1;
    },
    extraDefense() {
      return (this.weapon.defense ?? 0) + (this.pet.defense ?? 0) + this.level * 0.1;
    },
    extraAgility() {
      return (this.weapon.agiity ?? 0) + (this.pet.agiity ?? 0) + this.level * 0.1;
    },
    totalStrength() {
      return Math.floor(this.strength + this.extraStrength);
    },
    totalMagic() {
      return Math.floor(this.magic + this.extraMagic);
    },
    totalDefense() {
      return Math.floor(this.defense + this.extraDefense);
    },
    totalAgility() {
      return Math.floor(this.agility + this.extraAgility);
    },
    normalAttack() {
      return this.strength + basestats.normal;
    },
    heavyAttack() {
      return this.strength * 1.15 + basestats.heavy;
    },
    throwAttack() {
      return this.strength * 1.2 + basestats.throw;
    },
    spendStatPoints() {
      return this.strength + this.magic + this.defense + this.agility - 4;
    },
    totalStatPoints() {
      return this.level >= 20 ? 38 + (Math.min(this.level, 78) - 20) : (this.level - 1) * 2;
    },
  },
  data() {
    return {
      OG: false,
      isNormal: false,
      numPlayers: 1,
      level: 99,
      strength: 25,
      magic: 1,
      defense: 1,
      agility: 1,
      combo: 'x',
      weapon: {},
      weapons,
      pet: {},
      pets,
      normalDamage: 0,
      heavyDamage: 0,
      throwDamage: 0,
      magicDamage: 0,
      comboDamage: 0,
      output: '',
    };
  },
  methods: {
    calcCombo() {
      this.comboDamage = 0;
    },
    calcDamage: function (baseAttack) {
      return Math.floor(baseAttack + this.extraStrength);
    },
    updateStats() {
      this.heavyDamage = this.calcDamage(this.heavyAttack);
      this.throwDamage = this.calcDamage(this.throwAttack);
      const damage = this.calcDamage(this.normalAttack);
      this.normalDamage = damage;
      this.output = ccrstats(damage, this.isNormal);
      this.calcCombo();
    },
  },
  mounted() {
    this.weapon = weapons.find(x => x.name === 'Man Catcher');
    this.pet = pets.find(x => x.name === 'Snoot');
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
}

.output {
  flex: 1;
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
