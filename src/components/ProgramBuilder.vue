<template>
  <section class="programBuilder">
    <p class="title">Your workout</p>
    <ul class="list">
      <li v-for="(step, index) of workout.steps" :key="step.id">
        <div
          class="dropzone"
          @dragenter="dragEnter($event)"
          @dragleave="dragLeave($event)"
          @drop="dragDrop($event, index)"
          @dragover.prevent>
        </div>
        <program-builder-step
          :step="step"
          :isFirst="index === 0"
          :isLast="index === workout.steps.length - 1"
          @update="handleStepUpdate"
          @delete="handleStepDelete"
          @up="handleStepUp"
          @down="handleStepDown"
          draggable="true"
          @dragstart="dragStart($event, index)"
        />
      </li>
    </ul>
    <footer class="footer">
      <rounded-button class="addButton" @click="handleClickOnAddButton">Add one more</rounded-button>
    </footer>
  </section>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Workout from '../types/workout.d'
import ProgramBuilderStep from './ProgramBuilderStep.vue'
import RoundedButton from './RoundedButton.vue'

export default defineComponent({
  name: 'ProgramBuilder',
  components: {
    ProgramBuilderStep,
    RoundedButton
  },
  props: {
    workout!: { type: Object as () => Workout, required: true }
  },
  methods: {
    handleClickOnAddButton () {
      this.$emit('add-step')
    },
    handleStepUpdate (id: string, data: object) {
      const index = this.workout.steps.findIndex(step => step.id === id)
      if (index === -1) return
      this.$emit('update-step', index, {
        ...this.workout.steps[index],
        ...data
      })
    },
    handleStepDelete (id: string) {
      const index = this.workout.steps.findIndex(step => step.id === id)
      if (index === -1) return
      this.$emit('delete-step', index)
    },
    handleStepUp (id: string) {
      const index = this.workout.steps.findIndex(step => step.id === id)
      if (index === -1) return
      this.$emit('move-step', index, index - 1)
    },
    handleStepDown (id: string) {
      const index = this.workout.steps.findIndex(step => step.id === id)
      if (index === -1) return
      this.$emit('move-step', index, index + 1)
    },
    dragStart (event: DragEvent, index: number) {
      if (!event.dataTransfer) return

      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('index', String(index))
    },
    dragEnter (event: DragEvent) {
      const target = event.target as HTMLElement
      target.classList.add('drag-over')
    },
    dragLeave (event: DragEvent) {
      const target = event.target as HTMLElement
      target.classList.remove('drag-over')
    },
    dragDrop (event: DragEvent, newIndex: number) {
      if (!event.dataTransfer) return

      const target = event.target as HTMLElement
      target.classList.remove('drag-over')

      const index = parseInt(event.dataTransfer.getData('index'))
      // If we are moving an element lower, we need to shift the position
      if (newIndex > index) {
        newIndex--
      }
      this.$emit('move-step', index, newIndex)
    }
  }
})
</script>

<style lang="postcss" scoped>
  .programBuilder {
    height: 100%;
    padding: 18px;
    background-color: #d1d8e0;
    border-left: 6px solid #a5b1c2;
    overflow-y: auto;
  }
  .title {
    margin: 12px 0;
    font-size: 2rem;
    font-weight: 700;
  }
  .dropzone {
    height: 18px;
    transition: height .3s ease;

    &.drag-over {
      height: 120px;
    }
  }
  .footer {
    margin-top: 18px;
    text-align: center;
  }
  .addButton {
    width: 100%;
  }
</style>
