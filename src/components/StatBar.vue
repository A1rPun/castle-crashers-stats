<template>
  <div>
    <div class="statbar" :class="{ disabled: disabled }">
      <div
        v-for="item in stats"
        :key="item"
        :class="{ stat: true, lit: item <= actualValue, interval: item < length && item % interval === 0 }"
        @click="changed(item)"
        @mouseenter="mouseEnter(item)"
        @mouseleave="mouseLeave(actualValue)"
      >
        <span>{{ item === displayValue ? displayValue : '&nbsp;' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const maxStats = 25;

export default {
  name: 'StatBar',
  props: {
    value: {
      type: Number,
      default: 1,
    },
    disabled: Boolean,
    interval: {
      type: Number,
      default: maxStats + 1,
    },
    length: {
      type: Number,
      default: maxStats,
    },
  },
  data() {
    return {
      actualValue: this.value,
      displayValue: this.value,
      stats: Array.from({ length: this.length }, (_, i) => i + 1),
    };
  },
  watch: {
    value(newValue) {
      this.actualValue = newValue;
      this.displayValue = newValue;
    },
  },
  methods: {
    changed(value) {
      if (this.disabled) return;
      this.displayValue = value;
      this.actualValue = value;
      this.$emit('input', this.actualValue);
      this.$emit('change');
    },
    mouseEnter(val) {
      if (!this.disabled) this.displayValue = val;
    },
    mouseLeave(val) {
      if (!this.disabled) this.displayValue = val;
    },
  },
};
</script>

<style>
.statbar {
  position: relative;
  color: #000;
}

.statbar > .stat {
  width: calc(4% - 2px);
  height: 32px;
  background: #dfdfdf;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  display: inline-block;
  text-align: center;
}

.stat > span {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.statbar > .stat:first-child {
  border-left: 1px solid black;
}

.statbar > .lit {
  background: rgb(102, 204, 102);
}

.statbar.disabled > .stat {
  background: #9c9c9c;
}

.statbar.disabled > .lit {
  background: rgba(102, 204, 102, 0.5);
}

.statbar:not(.disabled):hover > .stat {
  background: #75f65c;
}

.statbar:not(.disabled) > .stat:hover ~ .stat {
  background: #f6f6f6;
}

.statbar > .interval {
  background: rgba(102, 204, 102, 0.8);
}

.statbar:not(.disabled):hover > .interval {
  background: rgba(102, 204, 102, 0.8);
}

.statbar:not(.disabled) > .stat:hover ~ .interval {
  background: rgba(102, 204, 102, 0.8);
}
</style>
