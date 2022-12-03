<template>
  <div :class="classes" v-if="step">
    <p class="label">Next step:</p>
    <p>{{ step.name ? step.name : step.type }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Step from '../types/step.d'

export default defineComponent({
  props: {
    step: { type: Object as () => Step, required: false },
    isVisible: Boolean,
  },
  computed: {
    classes(): Array<string> {
      const classes = ['programRunnerNextStep']
      if (this.isVisible) {
        classes.push('isVisible')
      }
      return classes
    },
  },
})
</script>

<style lang="postcss" scoped>
.programRunnerNextStep {
  padding: 24px;
  opacity: 0;
  visibility: hidden;

  &.isVisible {
    opacity: 1;
    visibility: visible;
  }
}
.label {
  margin-bottom: 0.25em;
}
</style>
