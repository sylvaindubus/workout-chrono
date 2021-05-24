<template>
  <section class="programRunnerTimer">
    <span v-if="hours !== '00'">{{ hours }}:</span>
    <span>{{ minutes }}:</span>
    <span>{{ seconds }}</span>
    <span class="small">{{ centiseconds }}</span>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { formatHours, formatMinutes, formatSeconds, formatCentiseconds } from '../helpers/formatters'

export default defineComponent({
  name: 'ProgramRunnerTimer',
  props: {
    time: { type: Number, required: true },
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

<style scoped>
.programRunnerTimer {
  font-size: 5rem;
}
.small {
  font-size: 0.6em;
}
</style>
