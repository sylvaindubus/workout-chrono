<template>
  <section class="programRunnerProgress">
    <ul>
      <li
        v-for="step in steps"
        :key="{ step }"
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
    currentStep: { type: Object as () => Step },
  },
  data() {
    return {
      totalDuration: 0,
    }
  },
  watch: {
    steps: {
      handler: function (steps: Array<Step>) {
        this.totalDuration = steps.reduce((prev: number, curr: Step) => {
          return curr.duration > 0 ? prev + curr.duration : prev + 60
        }, 0)
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getElementStyle(duration: number) {
      if (duration === 0) duration = 60
      const width = `${(duration * 100) / this.totalDuration}%`
      return { width }
    },
  },
})
</script>

<style lang="postcss" scoped>
.programRunnerProgress {
  width: 100%;
  overflow-y: hidden;
}
ul {
  display: flex;
  align-items: flex-end;
}
li {
  min-width: 3px;
  height: 6px;

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

  &.current {
    animation: shineBackground 2s infinite;
  }
}
</style>
