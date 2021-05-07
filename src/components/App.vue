<template>
  <main :class="{ isFull: !isAsideVisible }">
    <program-runner :workout="workout" />
    <button class="toggleButton" @click="toggleAside" v-if="!isAsideVisible" aria-label="Open aside">
      <icon width=28 height=28><icon-dumbbell /></icon>
    </button>
  </main>
  <aside :class="{ isVisible: isAsideVisible }">
    <workout-manager
      :workout="workout"
      :workouts="workouts"
      @create-workout="createWorkout"
      @rename-workout="renameWorkout"
      @select-workout="selectWorkout"
      @delete-workout="deleteWorkout"
    />
    <program-builder
      :workout="workout"
      @add-step="addStep"
      @update-step="updateStep"
      @clone-step="cloneStep"
      @delete-step="deleteStep"
      @move-step="moveStep"
    />
    <button class="toggleButton" @click="toggleAside" v-if="isAsideVisible" aria-label="Close aside">
      <icon width=28 height=28><icon-close /></icon>
    </button>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProgramBuilder from './ProgramBuilder.vue'
import ProgramRunner from './ProgramRunner.vue'
import WorkoutManager from './WorkoutManager.vue'
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
    WorkoutManager,
    Icon,
    IconDumbbell,
    IconClose
  },
  data () {
    // Temporary code to adapt from previous way of storing data
    if (localStorage.getItem('workout') && !localStorage.getItem('workouts')) {
      const workout = JSON.parse(localStorage.getItem('workout') || '{}')
      workout.id = generateId()
      localStorage.setItem('workouts', JSON.stringify([workout]))
      localStorage.removeItem('workout')
    }

    let workouts = this.loadWorkouts()
    if (!workouts) {
      workouts = [this.getNewWorkout()]
    }

    return {
      workouts,
      selectedId: workouts[0].id,
      isAsideVisible: false
    }
  },
  methods: {
    createWorkout () {
      const workout = this.getNewWorkout()
      this.workouts.push(workout)
      this.selectedId = workout.id
    },
    renameWorkout (name: string) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      workout.name = name !== '' ? name : 'Unnamed workout'
      this.updateWorkoutInList(workout)
    },
    selectWorkout (id: string) {
      this.selectedId = id
    },
    deleteWorkout () {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      this.removeWorkoutInList(workout)
      this.selectedId = this.workouts[0].id
    },
    addStep () {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      workout.steps.push({
        id: generateId(),
        type: StepType.Exercise,
        name: '',
        duration: 40,
        isNew: true
      })
      this.updateWorkoutInList(workout)
    },
    updateStep (index: number, step: Step) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      workout.steps[index] = step
      this.updateWorkoutInList(workout)
    },
    cloneStep (index: number) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      const clone = {
        ...workout.steps[index],
        id: generateId(),
        isNew: true
      }
      workout.steps.splice(index, 0, clone)
      this.updateWorkoutInList(workout)
    },
    deleteStep (index: number) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      workout.steps.splice(index, 1)
      this.updateWorkoutInList(workout)
    },
    moveStep (index: number, newIndex: number) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      const step = workout.steps.splice(index, 1)[0]
      workout.steps.splice(newIndex, 0, step)
      this.updateWorkoutInList(workout)
    },
    saveWorkouts () {
      // Remove new status from all workout's steps
      const workouts = this.workouts.map((workout: Workout) => {
        workout.steps = workout.steps.map(step => {
          step.isNew = false
          return step
        })
        return workout
      })
      // Save all workouts on local storage
      localStorage.setItem('workouts', JSON.stringify(workouts))
    },
    loadWorkouts (): Workout[] | null {
      if (!localStorage.getItem('workouts')) {
        return null
      }
      return JSON.parse(localStorage.getItem('workouts') || '[]')
    },
    toggleAside () {
      this.isAsideVisible = !this.isAsideVisible
    },
    fetchWorkoutInList (id: string): Workout | undefined {
      return this.workouts.find((w: Workout) => w.id === id)
    },
    updateWorkoutInList (workout: Workout) {
      this.workouts = this.workouts.map((w: Workout) => {
        if (w.id !== workout.id) return w
        workout.updatedAt = new Date()
        return workout
      })
    },
    removeWorkoutInList (workout: Workout) {
      this.workouts = this.workouts.filter((w: Workout) => w.id !== workout.id)
    },
    getNewWorkout (): Workout {
      return {
        id: generateId(),
        name: 'My workout',
        steps: [
          { id: generateId(), type: StepType.WarmUp, duration: 40, isNew: false },
          { id: generateId(), type: StepType.Exercise, name: 'Push-ups', duration: 60, isNew: false },
          { id: generateId(), type: StepType.Rest, duration: 20, isNew: false },
          { id: generateId(), type: StepType.Stretching, duration: 60, isNew: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  },
  computed: {
    workout (): Workout | undefined {
      return this.fetchWorkoutInList(this.selectedId)
    }
  },
  watch: {
    workouts: {
      handler: function () {
        // Clear the previous timeout (if any)
        clearTimeout(saveTimeout)
        // Save the workout after some seconds without changes
        saveTimeout = setTimeout(this.saveWorkouts, 2000)
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
    overflow-y: auto;
    background-color: #d1d8e0;
    border-left: 6px solid #a5b1c2;
    padding: 18px;
    transform: translateX(100%);
    transition: transform .4s;

    @media (min-width: 425px) {
      padding-top: 18px;
    }

    &.isVisible {
      transform: translateX(0px);
    }
  }
  .toggleButton {
    position: absolute;
    right: 18px;
    top: 18px;
    width: 48px;
    height: 48px;
    color: #fff;
    border-radius: 50%;
    background-color: #4b6584;
  }
</style>
