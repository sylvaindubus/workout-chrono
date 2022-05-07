<template>
  <section :class="['programRunnerTimer', isSmall ? 'isSmall' : '']">
    <span v-if="hours !== '00'">{{ hours }}:</span>
    <span>{{ minutes }}:</span>
    <span>{{ seconds }}</span>
    <span v-if="!hideCentiseconds" class="centiseconds">{{ centiseconds }}</span>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { formatHours, formatMinutes, formatSeconds, formatCentiseconds } from '../helpers/formatters'

export default defineComponent({
  name: 'ProgramRunnerTimer',
  props: {
    time: { type: Number, required: true },
    isSmall: { type: Boolean, default: false },
    hideCentiseconds: { type: Boolean, default: false },
  },
  computed: {
    hours(): string {
      return formatHours(this.time / 1000)
    },
    minutes(): string {
      return formatMinutes(this.time / 1000)
    },
    seconds(): string {
      return formatSeconds(this.time / 1000)
    },
    centiseconds(): string {
      return formatCentiseconds(this.time / 1000)
    },
  },
})
</script>

<style lang="postcss" scoped>
.programRunnerTimer {
  font-size: 5rem;

  &.isSmall {
    font-size: 1.5rem;
  }
}
.centiseconds {
  font-size: 0.6em;
}
</style>
