<template>
  <div>
    <div class="statbar">
      <span
        v-for="item in stats"
        :key="item"
        :class="{ lit: item <= value }"
        @click="changed(item)"
        @mouseenter="displayValue = item"
        @mouseleave="displayValue = value"
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
  },
  data() {
    return {
      displayValue: this.value,
      stats: Array.from({ length: 25 }, (_, i) => i + 1),
    };
  },
  methods: {
    changed(value) {
      this.displayValue = value;
      this.value = value;
      this.$emit('input', this.value);
      this.$emit('change');
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
  background: #c5c5c5;
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

.statbar:hover > span {
  background: #75f65c;
}

.statbar > span:hover ~ span {
  background: #d1d1d1;
}
</style>
