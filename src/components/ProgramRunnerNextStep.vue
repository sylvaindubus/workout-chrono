<template>
  <div :class="classes">
    <p class="label">Next step:</p>
    <p>{{ step && step.name ? step.name : '' }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    step: { type: Object, required: false },
    isVisible: Boolean
  },
  computed: {
    classes (): Array<string> {
      const classes = ['programRunnerNextStep']
      if (this.isVisible) {
        classes.push('isVisible')
      }
      return classes
    }
  }
})
</script>

<style lang="postcss" scoped>
  .programRunnerNextStep {
    opacity: 0;
    visibility: hidden;
    margin-top: 18px;

    &.isVisible {
      opacity: 1;
      visibility: visible;
    }
  }
  .label {
    margin-bottom: .25em;
  }
</style>
