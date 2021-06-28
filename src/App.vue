<template>
  <div class="container">
    <div class="input">
      <div class="game">
        <h3>Game</h3>
        <label>
          <span>Castle Crashers Remastered</span>
          <input type="radio" v-model="OG" :value="false" @change="updateStats" />
        </label>
        <label>
          <span> Castle Crashers</span>
          <input type="radio" v-model="OG" :value="true" @change="updateStats" />
        </label>
      </div>
      <div class="modes">
        <h3>Mode</h3>
        <label>
          <span>Normal</span>
          <input type="radio" v-model="mode" :value="1" @change="updateStats" />
        </label>
        <label>
          <span> Insane</span>
          <input type="radio" v-model="mode" :value="2" @change="updateStats" />
        </label>
        <label>
          <span> Arena</span>
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
          <span> 2p</span>
          <input type="radio" v-model="numPlayers" :value="2" @change="updateStats" />
        </label>
        <label>
          <span> 3p</span>
          <input type="radio" v-model="numPlayers" :value="3" @change="updateStats" />
        </label>
        <label>
          <span> 4p</span>
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
        <div>
          <span>Strength</span>
          <StatBar v-model="strength" @change="updateStats"></StatBar>
        </div>
        <div>
          <span>Magic</span>
          <StatBar v-model="magic" @change="updateStats"></StatBar>
        </div>
        <div>
          <span>Defense</span>
          <StatBar v-model="defense" @change="updateStats"></StatBar>
        </div>
        <div>
          <span>Agility</span>
          <StatBar v-model="agility" @change="updateStats"></StatBar>
        </div>
      </div>
      <div class="weapons">
        <h3>Weapon</h3>
        <select v-model="weapon" @change="updateStats">
          <option v-for="w in weapons" :value="w" :key="w.name">
            {{ w.name }}
          </option>
        </select>
        <span v-if="weaponStrength">strength:{{ weaponStrength }}</span>
        <span v-if="weaponMagic">magic:{{ weaponMagic }}</span>
        <span v-if="weaponDefense">defense:{{ weaponDefense }}</span>
        <span v-if="weaponAgility">agility:{{ weaponAgility }}</span>
        <span v-if="weaponCrit">crit:{{ weaponCrit }}%</span>
        <div v-if="weaponCrit">
          <label>
            <input type="checkbox" v-model="doCrit" @change="updateStats" />
            <span>Enemy gets hit with 100% critical strikes</span>
          </label>
        </div>
      </div>
      <div class="pets">
        <h3>Animal Orb</h3>
        <select v-model="pet" @change="updateStats">
          <option v-for="p in pets" :value="p" :key="p.name">
            {{ p.name }}
          </option>
        </select>
        <span v-if="petStrength">strength:{{ petStrength }}</span>
        <span v-if="petMagic">magic:{{ petMagic }}</span>
        <span v-if="petDefense">defense:{{ petDefense }}</span>
        <span v-if="petAgility">agility:{{ petAgility }}</span>
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
rt m = magic

Example: j lhl
Example: RTA XYY XYY XY XYY XY XY XY
          </pre>
        </div>
      </div>
    </div>
    <div class="output">
      <div v-if="this.mode < 3">
        <div v-if="(weapon.level || 1) > level">
          {{ weapon.name }} has a level requirement of <strong>{{ weapon.level }}</strong>
        </div>
        <div v-if="spendStatPoints < totalStatPoints">
          <strong>{{ totalStatPoints - spendStatPoints }}</strong> unspend stat points based on
          level {{ level }} ({{ totalStatPoints }}
          points)
        </div>
        <div v-if="spendStatPoints > totalStatPoints">
          spend <strong>{{ spendStatPoints - totalStatPoints }}</strong> stat points too much based
          on level {{ level }} ({{ totalStatPoints }} points)
        </div>
      </div>
      <h3>Stats total</h3>
      <div v-if="this.mode < 3">
        Exp: <strong>{{ experience }}</strong>
      </div>
      <div v-else>Level: <strong>30</strong></div>
      <div>
        Strength: <strong>{{ totalStrength }}</strong>
      </div>
      <div>
        Magic: <strong>{{ totalMagic }}</strong>
      </div>
      <div>
        Defense: <strong>{{ totalDefense }}</strong>
      </div>
      <div>
        Agility: <strong>{{ totalAgility }}</strong>
      </div>
      <h3>Damage</h3>
      <div>
        Base attack damage: <strong>{{ normalDamage }}</strong>
      </div>
      <div>
        Base heavy attack damage: <strong>{{ heavyDamage }}</strong>
      </div>
      <div>
        Base throw damage: <strong>{{ throwDamage }}</strong>
      </div>
      <div>
        Base magic damage (projectile/jump): <strong>{{ magicDamage }}</strong>
      </div>
      <div>
        Splash magic damage: <strong>{{ splashDamage }}</strong>
      </div>
      <div v-if="magic >= 15">
        Elemental infusion damage: <strong>{{ infusionDamage }}</strong> or
        <strong>{{ infusionDamage * 2 }}</strong> piercing
      </div>
      <div>
        Fire DoT: <strong>{{ dotDamage }}</strong>
      </div>
      <div>
        Poison DoT (3 hits): <strong>{{ dotDamage * 3 }}</strong>
      </div>
      <div>
        Arrow damage: <strong>{{ arrowDamage }}</strong>
      </div>
      <div v-if="this.mode < 3">
        Bomb damage: <strong>{{ bombDamage }}</strong>
      </div>
      <div>
        🧪 Combo damage: <strong>{{ comboDamage.reduce((prev, cur) => prev + cur, 0) }}</strong>
      </div>
      <h3>Defense</h3>
      <div>
        Health: <strong>{{ health }}</strong>
      </div>
      <div>
        Resistance: <strong>{{ resistance }}</strong>
      </div>
      <div>
        Damage taken: <strong>{{ damageTaken }}%</strong>
      </div>
      <div>
        Run speed: <strong>x{{ runSpeed }}</strong>
      </div>
      <h3>Enemy hits</h3>
      <div class="text_output" v-html="output"></div>
      <div>
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
      </div>
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
    weaponStrength() {
      return (
        (this.OG ? this.weapon?.ccStrength ?? this.weapon?.strength : this.weapon?.strength) ?? 0
      );
    },
    weaponMagic() {
      return (this.OG ? this.weapon?.ccMagic ?? this.weapon?.magic : this.weapon?.magic) ?? 0;
    },
    weaponDefense() {
      return (this.OG ? this.weapon?.ccDefense ?? this.weapon?.defense : this.weapon?.defense) ?? 0;
    },
    weaponAgility() {
      return (this.OG ? this.weapon?.ccAgility ?? this.weapon?.agility : this.weapon?.agility) ?? 0;
    },
    weaponCrit() {
      return (this.OG ? this.weapon?.ccCrit ?? this.weapon?.crit : this.weapon?.crit) ?? 0;
    },
    petStrength() {
      return (this.OG ? this.pet?.ccStrength ?? this.pet?.strength : this.pet?.strength) ?? 0;
    },
    petMagic() {
      return (this.OG ? this.pet?.ccMagic ?? this.pet?.magic : this.pet?.magic) ?? 0;
    },
    petDefense() {
      return (this.OG ? this.pet?.ccDefense ?? this.pet?.defense : this.pet?.defense) ?? 0;
    },
    petAgility() {
      return (this.OG ? this.pet?.ccAgility ?? this.pet?.agility : this.pet?.agility) ?? 0;
    },
    extraStrength() {
      return this.weaponStrength + this.petStrength + (this.mode === 3 ? 30 : this.level) * 0.1;
    },
    extraMagic() {
      return this.weaponMagic + this.petMagic;
    },
    extraDefense() {
      return this.weaponDefense + this.petDefense;
    },
    extraAgility() {
      return this.weaponAgility + this.petAgility;
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
    dotDamage() {
      return Math.floor(3 + this.magicDamage * 0.4 + this.level * 0.1);
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
      level: 1,
      strength: 1,
      magic: 1,
      defense: 1,
      agility: 1,
      combo: 'a xyy',
      defaultWeapon: 'Alien Gun',
      weapon: {},
      weapons,
      defaultPet: 'None',
      pet: {},
      pets,
      normalDamage: 0,
      heavyDamage: 0,
      throwDamage: 0,
      comboDamage: [],
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
    getUrlOptions() {
      const urlParams = new URLSearchParams(window.location.search);

      const og = urlParams.get('OG');
      if (og) this.OG = true;
      const mode = urlParams.get('mode');
      if (mode) this.mode = parseInt(mode, 10);
      const num = urlParams.get('players');
      if (num) this.numPlayers = parseInt(num, 10);
      const lvl = urlParams.get('lvl');
      if (lvl) this.level = parseInt(lvl, 10);
      const str = urlParams.get('str');
      if (str) this.strength = parseInt(str, 10);
      const mag = urlParams.get('mag');
      if (mag) this.magic = parseInt(mag, 10);
      const def = urlParams.get('def');
      if (def) this.defense = parseInt(def, 10);
      const agi = urlParams.get('agi');
      if (agi) this.agility = parseInt(agi, 10);
      const weap = urlParams.get('weap');
      if (weap) this.defaultWeapon = weap;
      const crit = urlParams.get('crit');
      if (crit) this.doCrit = true;
      const orb = urlParams.get('orb');
      if (orb) this.defaultPet = orb;
      const combo = urlParams.get('combo');
      if (combo) this.combo = combo;
    },
    setUrloptions() {
      const urlParams = new URLSearchParams();
      if (this.OG) urlParams.set('OG', 1);
      if (this.mode > 1) urlParams.set('mode', this.mode);
      if (this.numPlayers > 1) urlParams.set('players', this.numPlayers);
      if (this.level > 1) urlParams.set('lvl', this.level);
      if (this.strength > 1) urlParams.set('str', this.strength);
      if (this.magic > 1) urlParams.set('mag', this.magic);
      if (this.defense > 1) urlParams.set('def', this.defense);
      if (this.agility > 1) urlParams.set('agi', this.agility);
      if (this.weapon?.name !== 'Alien Gun') urlParams.set('weap', this.weapon.name);
      if (this.pet?.name !== 'None') urlParams.set('orb', this.pet.name);
      if (this.doCrit) urlParams.set('crit', 1);
      if (this.combo !== 'a xyy') urlParams.set('combo', this.combo);
      window.history.replaceState(
        {},
        '',
        window.location.pathname + (urlParams.toString() ? '?' + urlParams : '')
      );
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
🧪 ${this.comboDamage.reduce((acc, cur) => acc + this.calcArenaDamage(cur), 0)} combo damage with ${
          this.comboDamage.length
        } hits`;
      }
      this.setUrloptions();
    },
  },
  mounted() {
    this.getUrlOptions();
    this.weapon = weapons.find(x => x.name === this.defaultWeapon);
    this.pet = pets.find(x => x.name === this.defaultPet);
    this.updateStats();
  },
};
</script>

<style>
html,
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  box-sizing: border-box;
  /* overflow: hidden; */
}

* {
  cursor: url(assets/NG_Gold_Sword.png), auto;
}

.container {
  display: flex;
  flex-direction: column;
}

.input {
  flex: 1;
  padding: 0 32px 32px;
  background: #222;
  color: #eee;
}

.output {
  flex: 1;
  padding: 0 32px 32px;
  overflow-x: hidden;
  background: rgb(102, 204, 102);
  background: linear-gradient(
    135deg,
    rgba(102, 204, 102, 1) 0%,
    rgba(254, 0, 0, 1) 33%,
    rgba(101, 153, 255, 1) 66%,
    rgba(254, 153, 0, 1) 100%
  );
}

.stats {
  display: flex;
  flex-direction: column;
}

.text_output {
  white-space: pre;
}

.weapons > span,
.pets > span {
  margin-left: 8px;
}

@media only screen and (min-width: 768px) {
  .container {
    flex-direction: row;
    height: 100vh;
  }

  .input {
    overflow-y: auto;
  }

  .output {
    overflow-y: auto;
  }
}
</style>
