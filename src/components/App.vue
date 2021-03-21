<template>
  <main :class="{ isFull: !isBuilderVisible }">
    <program-runner :workout="workout" />
    <button class="toggleButton" @click="toggleBuilder" v-if="!isBuilderVisible" aria-label="Open program">
      <icon width=32 height=32><icon-dumbbell /></icon>
    </button>
  </main>
  <aside :class="{ isVisible: isBuilderVisible }">
    <program-builder
      :workout="workout"
      @add-step="addStep"
      @update-step="updateStep"
      @clone-step="cloneStep"
      @delete-step="deleteStep"
      @move-step="moveStep"
    />
    <button class="toggleButton" @click="toggleBuilder" v-if="isBuilderVisible" aria-label="Close program">
      <icon width=32 height=32><icon-close /></icon>
    </button>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProgramBuilder from './ProgramBuilder.vue'
import ProgramRunner from './ProgramRunner.vue'
import Icon from './icons/Icon.vue'
import IconDumbbell from './icons/IconDumbbell.vue'
import IconClose from './icons/IconClose.vue'
import Step from '../types/step'
import Workout from '../types/workout'
import StepType from '../types/stepType'
import generateId from '../helpers/generateId'

let saveTimeout: number

export default defineComponent({
  name: 'App',
  components: {
    ProgramBuilder,
    ProgramRunner,
    Icon,
    IconDumbbell,
    IconClose
  },
  data () {
    let workout: Workout
    if (localStorage.getItem('workout')) {
      workout = JSON.parse(localStorage.getItem('workout') || '')
    } else {
      workout = {
        name: 'My workout',
        steps: [
          { id: generateId(), type: StepType.WarmUp, duration: 40 },
          { id: generateId(), type: StepType.Exercise, name: 'Push-ups', duration: 60 },
          { id: generateId(), type: StepType.Rest, duration: 20 },
          { id: generateId(), type: StepType.Stretching, duration: 60 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    return {
      workout,
      isBuilderVisible: false
    }
  },
  methods: {
    addStep () {
      this.workout.steps.push({ id: generateId(), type: StepType.Exercise, name: '', duration: 40 })
    },
    updateStep (index: number, step: Step) {
      this.workout.steps[index] = step
    },
    cloneStep (index: number) {
      const clone = {
        ...this.workout.steps[index],
        id: generateId()
      }
      this.workout.steps.splice(index, 0, clone)
    },
    deleteStep (index: number) {
      this.workout.steps.splice(index, 1)
    },
    moveStep (index: number, newIndex: number) {
      const step = this.workout.steps.splice(index, 1)[0]
      this.workout.steps.splice(newIndex, 0, step)
    },
    saveWorkout (workout: Workout) {
      localStorage.setItem('workout', JSON.stringify({
        ...workout,
        updatedAt: new Date()
      }))
    },
    toggleBuilder () {
      this.isBuilderVisible = !this.isBuilderVisible
    }
  },
  watch: {
    workout: {
      handler: function (newWorkout: Workout) {
        // Clear the previous timeout (if any)
        clearTimeout(saveTimeout)
        // Save the workout after some seconds without changes
        saveTimeout = setTimeout(this.saveWorkout.bind(this, newWorkout), 2000)
      },
      deep: true
    }
  }
})
</script>

<style lang="postcss">
  main {
    position: relative;
    width: 100%;
    transition: width .4s;

    @media (min-width: 768px) {
      width: calc(100% - 450px);
    }

    &.isFull {
      width: 100%;
    }
  }
  aside {
    position: fixed;
    right: 0;
    width: 450px;
    max-width: 100vw;
    height: 100%;
    transform: translateX(100%);
    transition: transform .4s;

    &.isVisible {
      transform: translateX(0px);
    }
  }
  .toggleButton {
    position: absolute;
    right: 18px;
    top: 18px;
    width: 54px;
    height: 54px;
    border: none;
    color: #fff;
    border-radius: 50%;
    background-color: #4b6584;
  }
</style>
