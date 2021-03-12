<template>
  <section class="programRunnerProgress">
    <ul>
      <li
        v-for="step in steps"
        :key={step}
        :class="[step === currentStep ? 'current' : '', `${step.type.toLowerCase()}Color`]"
        :style="getElementStyle(step.duration)"
      ></li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Step from '../types/step.d'

export default defineComponent({
  name: 'ProgramRunnerProgress',
  props: {
    steps: { type: Array as () => Array<Step>, required: true },
    currentStep: { type: Object as () => Step }
  },
  computed: {
    totalDuration (): number {
      return this.steps.reduce((prev: number, curr: Step) => prev + curr.duration, 0)
    }
  },
  methods: {
    getElementStyle (duration: number) {
      const width = `${duration * 100 / this.totalDuration}%`
      return { width }
    }
  }
})
</script>

<style lang="postcss" scoped>
  .programRunnerProgress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: hidden;
  }
  ul {
    display: flex;
    align-items: flex-end;
  }
  li {
    min-width: 3px;
    height: 6px;
    transition: height .75s ease;

    &.current {
      height: 12px;
    }

    &.warmupColor {
      background-color: #f7b731;
    }

    &.exerciseColor {
      background-color: #eb3b5a;
    }

    &.restColor {
      background-color: #2d98da;
    }

    &.stretchingColor {
      background-color: #20bf6b;
    }
  }
</style>
