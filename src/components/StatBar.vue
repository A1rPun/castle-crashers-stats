<template>
  <div>
    <div class="statbar" :class="{ disabled: disabled }">
      <span
        v-for="item in stats"
        :key="item"
        :class="{ lit: item <= value }"
        @click="changed(item)"
        @mouseenter="mouseEnter(item)"
        @mouseleave="mouseLeave(value)"
      ></span>
      <div class="center">{{ displayValue }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatBar',
  props: {
    value: Number,
    disabled: Boolean,
  },
  data() {
    return {
      displayValue: this.value,
      stats: Array.from({ length: 25 }, (_, i) => i + 1),
    };
  },
  watch: {
    value(newValue) {
      this.displayValue = newValue;
    },
  },
  methods: {
    changed(value) {
      if (this.disabled) return;
      this.displayValue = value;
      this.value = value;
      this.$emit('input', this.value);
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
.center {
  /* TODO: FIX */
  position: absolute;
  top: 20%;
  left: 20%;
  pointer-events: none;
}

.statbar {
  position: relative;
}

.statbar > span {
  width: 16px;
  height: 32px;
  background: #dfdfdf;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  display: inline-block;
}

.statbar > span:first-child {
  border-left: 1px solid black;
}

.statbar > span.lit {
  background: #4bce32;
}

.statbar.disabled > span {
  background: #9c9c9c;
}

.statbar.disabled > span.lit {
  background: #318820;
}

.statbar:not(.disabled):hover > span {
  background: #75f65c;
}

.statbar:not(.disabled) > span:hover ~ span {
  background: #f6f6f6;
}
</style>
