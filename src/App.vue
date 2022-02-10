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
      <div class="players" v-if="!isArena">
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
      <div class="stats" v-if="!isArena">
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
          Apply critical strike:
          <label>
            <span> No crit</span>
            <input type="radio" v-model="doCrit" :value="0" @change="updateStats" />
          </label>
          <label>
            <span> Weapon crit</span>
            <input type="radio" v-model="doCrit" :value="1" @change="updateStats" />
          </label>
          <label>
            <span> 100% crit</span>
            <input type="radio" v-model="doCrit" :value="2" @change="updateStats" />
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
        <h3>Combo</h3>
        <div>
          <input type="text" v-model="combo" @change="updateStats" placeholder="Example: j hhll" />
          <pre>
x  l = light attack
y  h = heavy attack
a  j = jump
b  u = use item (arrow)
rt m = magic
          </pre>
        </div>
      </div>
      <div>
        <h3>Enemy hits</h3>
        <select v-model="enemyHits" @change="updateStats">
          <option v-for="eho in enemyHitOptions" :value="eho" :key="eho">
            {{ eho }}
          </option>
        </select>
      </div>
    </div>
    <div class="output">
      <div v-if="!isArena">
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
      <div v-if="!isArena">
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
        Base attack damage: <strong>{{ lightDamage }}</strong>
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
      <div v-if="!isArena">
        Bomb damage: <strong>{{ bombDamage }}</strong>
      </div>
      <div v-if="totalComboDamage">
        Combo damage: <strong>{{ totalComboDamage }}</strong>
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
      <div>
        King Healing: <strong>{{ healing }}hp</strong>, {{ Math.ceil(health / healing) }} times for
        full health
      </div>
      <h3>Enemy hits</h3>
      <div class="text_output" v-html="output"></div>
      <h3>Unlocked melee combo's</h3>
      <div>Throw (H)</div>
      <div>Stomp (H)</div>
      <div v-if="isArena || level >= 2">Spin attack (JJ)</div>
      <div v-if="isArena || level >= 4">Sprint attack (L or H)</div>
      <div v-if="isArena || level >= 8">Uppercut (LH)</div>
      <div v-if="isArena || level >= 16">Headbutt (LLH)</div>
      <div v-if="isArena || level >= 32">Slashing Headbutt (LLHH)</div>
      <div v-if="!isArena && level >= 50 && magic >= 15">Drill (LLLHH)</div>
      <h3>Unlocked magic combo's</h3>
      <div>Splash magic (MH)</div>
      <div v-if="isArena || magic >= 5">Projectile magic (MU)</div>
      <div v-if="isArena || magic >= 10">Air Projectile magic (JMH or JMU)</div>
      <div v-if="isArena || magic >= 15">Elemental Infusion (LLLH)</div>
      <div v-if="isArena || magic >= 20">Magic jump (MJ)</div>
      <h3>Other Damage</h3>
      <div>Spin attack damage: <strong>1</strong></div>
      <div v-if="!isArena">Fall damage: <strong>7</strong></div>
      <div v-if="!isArena">Wall damage: <strong>5</strong></div>
      <div v-if="!isArena">Domino damage: <strong>1</strong> + <strong>2</strong> * enemies</div>
      <div>Running mount damage: <strong>1</strong></div>
      <div>Mount damage spit: <strong v-if="isArena">9</strong><strong v-else>?</strong></div>
      <div>Mount damage snap: <strong v-if="isArena">9</strong><strong v-else>?</strong></div>
      <div v-if="!isArena">
        Shovel damage: <strong>{{ shovelDamage }}</strong>
      </div>
      <div v-if="!isArena">
        Horn damage: <strong>{{ hornDamage }}</strong>
      </div>
      <div v-if="!isArena">Boomerang damage: <strong>1</strong></div>
    </div>
  </div>
</template>

<script>
import StatBar from './components/StatBar';
import { formatEnemies, formatEnemyHits } from './scripts/formatStats.js';
import arena from './assets/arena.js';
import weapons from './assets/weapons.js';
import pets from './assets/pets.js';
import calculateDamage from './scripts/calculateDamage.js';
import { lightDamage, heavyDamage, throwDamage } from './scripts/damage.js';
import { arrowDamage } from './scripts/agility.js';
import { health, resistance } from './scripts/defense.js';
import { magic } from './scripts/magic.js';
import parseCombo from './scripts/parseCombo.js';

export default {
  name: 'CCStats',
  components: {
    StatBar,
  },
  computed: {
    isArena() {
      return this.mode === 3;
    },
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
    actualStrength() {
      return (
        (this.isArena ? arena.Strength : this.strength || 1) + this.weaponStrength + this.petStrength
      );
    },
    actualMagic() {
      return (this.isArena ? arena.Magic : this.magic || 1) + this.weaponMagic + this.petMagic;
    },
    actualDefense() {
      return (this.isArena ? arena.Defense : this.defense || 1) + this.weaponDefense + this.petDefense;
    },
    actualAgility() {
      return (this.isArena ? arena.Agility : this.agility || 1) + this.weaponAgility + this.petAgility;
    },
    totalLevel() {
      return this.isArena ? arena.Level : this.level;
    },
    totalStrength() {
      return Math.floor(this.actualStrength + this.totalLevel * 0.1);
    },
    totalMagic() {
      return Math.floor(this.actualMagic + this.totalLevel * 0.1);
    },
    totalDefense() {
      return Math.floor(this.actualDefense);
    },
    totalAgility() {
      return Math.floor(this.actualAgility);
    },
    lightDamage() {
      return lightDamage(this.totalLevel, this.actualStrength);
    },
    heavyDamage() {
      return heavyDamage(this.totalLevel, this.actualStrength);
    },
    throwDamage() {
      return throwDamage(this.totalLevel, this.actualStrength);
    },
    magicDamage() {
      return magic(this.totalLevel, this.actualMagic);
    },
    splashDamage() {
      return Math.ceil(this.magicDamage * 0.5);
    },
    infusionDamage() {
      return this.lightDamage + this.magicDamage;
    },
    dotDamage() {
      return Math.floor(3 + this.magicDamage * 0.4 + this.totalLevel * 0.1);
    },
    healing() {
      return Math.round(this.magicDamage * 0.25);
    },
    arrowDamage() {
      return arrowDamage(this.totalAgility);
    },
    bombDamage() {
      return (this.magicDamage < this.throwDamage ? this.throwDamage : this.magicDamage) * 2;
    },
    shovelDamage() {
      return this.lightDamage + this.heavyDamage;
    },
    hornDamage() {
      return this.throwDamage;
    },
    spendStatPoints() {
      return this.strength + this.magic + this.defense + this.agility - 4;
    },
    totalStatPoints() {
      return this.level >= 20 ? 38 + (Math.min(this.level, 78) - 20) : (this.level - 1) * 2;
    },
    health() {
      return this.isArena ? arena.NormalHealth : health(this.totalLevel, this.totalDefense);
    },
    resistance() {
      return resistance(this.totalDefense);
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
    totalComboDamage() {
      return this.comboDamage?.reduce((prev, cur) => prev + cur, 0);
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
      combo: 'j hhll',
      defaultWeapon: 'Alien Gun',
      weapon: {},
      weapons,
      defaultPet: 'None',
      pet: {},
      pets,
      comboDamage: [],
      output: '',
      doCrit: 0,
      enemyHits: 'Light attack',
      enemyHitOptions: [
        'Light attack',
        'Heavy attack',
        'Throw',
        'Stomp',
        'Arrow',
        'Bomb',
        'Shovel',
        'Horn',
        'Combo',
      ],
    };
  },
  methods: {
    calcArenaDamage: function (baseDamage) {
      return Math.floor(calculateDamage(-10, baseDamage));
    },
    arenaOutput() {
      const arenaPlayer = formatEnemyHits(
        'Arena player',
        arena,
        this.getDamageList(),
        1,
        1,
        this.doCrit ? (this.doCrit === 1 ? this.weaponCrit : 100) : 0
      );
      return `${arenaPlayer}
${this.calcArenaDamage(this.lightDamage)} light damage
${this.calcArenaDamage(this.heavyDamage)} heavy damage
${this.calcArenaDamage(this.throwDamage)} throw damage
${this.calcArenaDamage(this.splashDamage)} splash magic damage
${this.calcArenaDamage(this.magicDamage)} projectile/jump magic damage
${
  this.comboDamage
    ? `${this.comboDamage.reduce(
        (acc, cur) => acc + this.calcArenaDamage(cur),
        0
      )} combo damage with ${this.comboDamage.length} hits`
    : ''
}`;
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
      if (crit) this.doCrit = crit;
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
      if (this.doCrit) urlParams.set('crit', this.doCrit);
      if (this.combo && this.combo !== 'j hhll') urlParams.set('combo', this.combo);
      window.history.replaceState(
        {},
        '',
        window.location.pathname + (urlParams.toString() ? '?' + urlParams : '')
      );
    },
    getDamageList() {
      if (this.enemyHits === 'Heavy attack') return [this.heavyDamage];
      if (this.enemyHits === 'Throw') return [this.throwDamage];
      if (this.enemyHits === 'Arrow') return [this.arrowDamage];
      if (this.enemyHits === 'Bomb') return [this.bombDamage];
      if (this.enemyHits === 'Shovel') return [this.shovelDamage];
      if (this.enemyHits === 'Horn') return [this.hornDamage];
      if (this.enemyHits === 'Combo') return this.comboDamage ?? [];
      return [this.lightDamage];
    },
    updateStats() {
      if (!this.weapon?.crit) this.doCrit = 0;
      this.comboDamage = parseCombo(
        this.combo,
        this.lightDamage,
        this.heavyDamage,
        this.throwDamage,
        this.magicDamage,
        this.splashDamage,
        this.infusionDamage,
        this.arrowDamage
      );
      if (!this.isArena)
        this.output = formatEnemies(
          this.getDamageList(),
          this.mode === 1,
          this.numPlayers,
          this.doCrit ? (this.doCrit === 1 ? this.weaponCrit : 100) : 0
        );
      else {
        this.output = this.arenaOutput();
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
