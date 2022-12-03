<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 16 16">
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script lang="ts">
export default {
  props: {
    width: {
      type: [Number, String],
      default: 18,
    },
    height: {
      type: [Number, String],
      default: 18,
    },
    iconColor: {
      type: String,
      default: 'currentColor',
    },
  },
}
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
}
</style>
