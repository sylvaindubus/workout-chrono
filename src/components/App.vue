<template>
  <main :class="{ isFull: visibleSection === sectionTypes.Main }">
    <program-runner :workout="workout" :isMute="isMute" />
    <div class="buttons">
      <button class="button" @click="showWorkout" aria-label="Show the workout program">
        <icon width="28" height="28"><icon-dumbbell /></icon>
      </button>
      <button class="button" @click="toggleMute" aria-label="Mute/unmute the sound">
        <icon width="28" height="28" v-if="isMute">
          <icon-mute />
        </icon>
        <icon width="28" height="28" v-else>
          <icon-sound />
        </icon>
      </button>
      <button class="button" @click="showAbout" aria-label="Show the about section">
        <icon width="28" height="28"><icon-question /></icon>
      </button>
    </div>
  </main>
  <aside :class="{ isVisible: visibleSection !== sectionTypes.Main }">
    <workout-manager
      v-if="visibleSection === sectionTypes.Workout"
      :workout="workout"
      :workouts="workouts"
      @create-workout="createWorkout"
      @rename-workout="renameWorkout"
      @select-workout="selectWorkout"
      @delete-workout="deleteWorkout"
    />
    <program-builder
      v-if="visibleSection === sectionTypes.Workout"
      :workout="workout"
      @add-step="addStep"
      @update-step="updateStep"
      @clone-step="cloneStep"
      @delete-step="deleteStep"
      @move-step="moveStep"
    />
    <about v-if="visibleSection === sectionTypes.About" />
    <div class="buttons">
      <button class="button" @click="hideAside" aria-label="Close aside">
        <icon width="28" height="28"><icon-close /></icon>
      </button>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProgramBuilder from './ProgramBuilder.vue'
import ProgramRunner from './ProgramRunner.vue'
import WorkoutManager from './WorkoutManager.vue'
import About from './About.vue'
import Icon from './icons/Icon.vue'
import IconDumbbell from './icons/IconDumbbell.vue'
import IconClose from './icons/IconClose.vue'
import IconMute from './icons/IconMute.vue'
import IconSound from './icons/IconSound.vue'
import IconQuestion from './icons/IconQuestion.vue'
import Step from '../types/step'
import Workout from '../types/workout'
import StepType from '../types/stepType'
import generateId from '../helpers/generateId'

let saveTimeout: number

enum Section {
  Main,
  Workout,
  About,
}

export default defineComponent({
  name: 'App',
  components: {
    ProgramBuilder,
    ProgramRunner,
    WorkoutManager,
    About,
    Icon,
    IconDumbbell,
    IconClose,
    IconMute,
    IconSound,
    IconQuestion,
  },
  beforeMount() {
    if (navigator.storage && navigator.storage.persist) {
      // Try to make the local storage persistent, not sure it works though
      navigator.storage.persist()
    }
  },
  data() {
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

    let selectedId = localStorage.getItem('selectedWorkoutId') as string
    if (!workouts.find((w: Workout) => w.id === selectedId)) {
      selectedId = workouts[0].id
    }

    const isMute = !!(localStorage.getItem('isMute') && localStorage.getItem('isMute') === '1')

    return {
      workouts,
      selectedId,
      sectionTypes: Section,
      visibleSection: Section.Main,
      isMute,
    }
  },
  methods: {
    createWorkout() {
      const workout = this.getNewWorkout()
      this.workouts.push(workout)
      this.selectedId = workout.id
    },
    renameWorkout(name: string) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      workout.name = name !== '' ? name : 'Unnamed workout'
      this.updateWorkoutInList(workout)
    },
    selectWorkout(id: string) {
      this.selectedId = id
      localStorage.setItem('selectedWorkoutId', id)
    },
    deleteWorkout() {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      this.removeWorkoutInList(workout)
      this.selectedId = this.workouts[0].id
      localStorage.setItem('selectedWorkoutId', this.selectedId)
    },
    addStep(newId: string) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      workout.steps.push({
        id: newId,
        type: StepType.Exercise,
        name: '',
        duration: 40,
      })
      this.updateWorkoutInList(workout)
    },
    updateStep(index: number, step: Step) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      workout.steps[index] = step
      this.updateWorkoutInList(workout)
    },
    cloneStep(index: number, newId: string) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      const clone = {
        ...workout.steps[index],
        id: newId,
      }
      workout.steps.splice(index + 1, 0, clone)
      this.updateWorkoutInList(workout)
    },
    deleteStep(index: number) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      workout.steps.splice(index, 1)
      this.updateWorkoutInList(workout)
    },
    moveStep(index: number, newIndex: number) {
      const workout = this.fetchWorkoutInList(this.selectedId)
      if (!workout) return

      const step = workout.steps.splice(index, 1)[0]
      workout.steps.splice(newIndex, 0, step)
      this.updateWorkoutInList(workout)
    },
    saveWorkouts() {
      // Save all workouts on local storage
      localStorage.setItem('workouts', JSON.stringify(this.workouts))
    },
    loadWorkouts(): Workout[] | null {
      if (!localStorage.getItem('workouts')) {
        return null
      }
      return JSON.parse(localStorage.getItem('workouts') || '[]')
    },
    showWorkout() {
      this.visibleSection = Section.Workout
    },
    toggleMute() {
      this.isMute = !this.isMute
      localStorage.setItem('isMute', this.isMute ? '1' : '0')
    },
    showAbout() {
      this.visibleSection = Section.About
    },
    hideAside() {
      this.visibleSection = Section.Main
    },
    fetchWorkoutInList(id: string): Workout | undefined {
      return this.workouts.find((w: Workout) => w.id === id)
    },
    updateWorkoutInList(workout: Workout) {
      this.workouts = this.workouts.map((w: Workout) => {
        if (w.id !== workout.id) return w
        workout.updatedAt = new Date()
        return workout
      })
    },
    removeWorkoutInList(workout: Workout) {
      this.workouts = this.workouts.filter((w: Workout) => w.id !== workout.id)
    },
    getNewWorkout(): Workout {
      return {
        id: generateId(),
        name: 'My workout',
        steps: [
          {
            id: generateId(),
            type: StepType.WarmUp,
            duration: 40,
          },
          {
            id: generateId(),
            type: StepType.Exercise,
            name: 'Push-ups',
            duration: 60,
          },
          {
            id: generateId(),
            type: StepType.Rest,
            duration: 20,
          },
          {
            id: generateId(),
            type: StepType.Stretching,
            duration: 60,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
  },
  computed: {
    workout(): Workout {
      return this.fetchWorkoutInList(this.selectedId) ?? this.workouts[0]
    },
  },
  watch: {
    workouts: {
      handler: function () {
        // Clear the previous timeout (if any)
        clearTimeout(saveTimeout)
        // Save the workout after some time without changes
        saveTimeout = setTimeout(this.saveWorkouts, 500)
      },
      deep: true,
    },
  },
})
</script>

<style lang="postcss" scoped>
main {
  position: relative;
  width: 100%;
  transition: width 0.4s;

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
  transition: transform 0.4s;

  @media (min-width: 425px) {
    padding-top: 18px;
  }

  &.isVisible {
    transform: translateX(0px);
  }
}
.buttons {
  position: absolute;
  right: 18px;
  top: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.button {
  width: 48px;
  height: 48px;
  color: #fff;
  border-radius: 50%;
  background-color: #4b6584;
}
</style>
