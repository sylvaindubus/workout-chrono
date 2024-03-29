<template>
  <section class="workoutManager">
    <button v-if="!isRenaming" class="switchButton" @click="toggleSelect" aria-label="Select another workout">
      <icon width="32" height="32" :class="['icon', isSelecting ? 'reverse' : '']">
        <icon-caret-down />
      </icon>
      <span>{{ name }}</span>
    </button>
    <ul class="selector" v-if="isSelecting">
      <li v-for="w of workouts" :key="w.id" @click="selectWorkout(w.id)">{{ w.name }}</li>
      <li @click="createWorkout">
        <icon width="32" height="32" class="iconBeforeLabel"><icon-add-circle /></icon>
        <span>New workout</span>
      </li>
    </ul>
    <div v-if="isRenaming">
      <input :value="name" class="nameInput" @change="handleNameUpdate($event)" />
    </div>
    <div v-if="isRenaming">
      <rounded-button class="actionButton confirmColor" @click="renameWorkout">
        <icon width="24" height="24" class="iconBeforeLabel"><icon-check /></icon>
        <span>Rename</span>
      </rounded-button>
      <rounded-button class="actionButton cancelColor" @click="cancelRenaming">
        <icon width="24" height="24" class="iconBeforeLabel"><icon-close /></icon>
        <span>Cancel</span>
      </rounded-button>
    </div>
    <div v-if="isDeleting">
      <p class="question">Are you sure buddy?</p>
      <rounded-button class="actionButton confirmColor" @click="deleteWorkout">
        <icon width="24" height="24" class="iconBeforeLabel"><icon-check /></icon>
        <span>Delete</span>
      </rounded-button>
      <rounded-button class="actionButton cancelColor" @click="cancelDeleting">
        <icon width="24" height="24" class="iconBeforeLabel"><icon-close /></icon>
        <span>Cancel</span>
      </rounded-button>
    </div>
    <div v-if="!isSelecting && !isRenaming && !isDeleting">
      <rounded-button class="actionButton" @click="toggleRename">
        <icon width="24" height="24" class="iconBeforeLabel"><icon-edit /></icon>
        <span>Rename</span>
      </rounded-button>
      <rounded-button class="actionButton" @click="toggleDelete" v-if="workouts.length > 1">
        <icon width="24" height="24" class="iconBeforeLabel"><icon-trash /></icon>
        <span>Delete</span>
      </rounded-button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Workout from '../types/workout.d'
import RoundedButton from './RoundedButton.vue'
import Icon from './icons/Icon.vue'
import IconAddCircle from './icons/IconAddCircle.vue'
import IconCaretDown from './icons/IconCaretDown.vue'
import IconCheck from './icons/IconCheck.vue'
import IconClose from './icons/IconClose.vue'
import IconEdit from './icons/IconEdit.vue'
import IconTrash from './icons/IconTrash.vue'

export default defineComponent({
  name: 'WorkoutManager',
  components: {
    RoundedButton,
    Icon,
    IconAddCircle,
    IconCaretDown,
    IconCheck,
    IconClose,
    IconEdit,
    IconTrash,
  },
  props: {
    workout: { type: Object as () => Workout, required: true },
    workouts: { type: Array as () => Workout[], required: true },
  },
  methods: {
    toggleSelect() {
      this.isSelecting = !this.isSelecting
      if (this.isSelecting && this.isDeleting) {
        this.isDeleting = false
      }
    },
    selectWorkout(id: string) {
      this.$emit('select-workout', id)
      this.isSelecting = false
    },
    createWorkout() {
      this.$emit('create-workout')
      this.isSelecting = false
    },
    toggleRename() {
      this.isRenaming = !this.isRenaming
    },
    toggleDelete() {
      this.isDeleting = !this.isDeleting
    },
    renameWorkout() {
      this.$emit('rename-workout', this.name)
      this.isRenaming = false
    },
    cancelRenaming() {
      this.name = this.workout.name
      this.isRenaming = false
    },
    deleteWorkout() {
      this.$emit('delete-workout')
      this.isDeleting = false
    },
    cancelDeleting() {
      this.isDeleting = false
    },
    handleNameUpdate(event: Event) {
      const { value } = event.currentTarget as HTMLInputElement
      this.name = value
    },
  },
  data() {
    return {
      name: this.workout.name,
      isSelecting: false,
      isRenaming: false,
      isDeleting: false,
    }
  },
  watch: {
    workout() {
      this.name = this.workout.name
    },
  },
})
</script>

<style lang="postcss" scoped>
.workoutManager {
  margin-bottom: 24px;
}

.actionButton {
  margin: 0 12px 12px 0;

  &.confirmColor {
    color: #20bf6b;
  }

  &.cancelColor {
    color: #eb3b5a;
  }
}
.switchButton {
  display: flex;
  max-width: calc(100% - 60px);
  min-height: 48px;
  margin-bottom: 12px;
  font-size: 1.75rem;
  text-align: left;
  align-items: flex-start;
  border: none;
  background: none;
  color: inherit;

  & .icon {
    margin-right: 6px;
  }
}
.icon {
  transition: transform 0.2s ease;
  &.reverse {
    transform: rotate(180deg);
  }
}
.question {
  margin-bottom: 12px;
  font-size: 1.25rem;
}
.nameInput {
  border: none;
  width: 200px;
  max-width: 100%;
  height: 48px;
  margin: 0 6px 12px 0;
  padding: 12px;
  border-radius: 4px;
  border: 2px solid #ebebeb;
  background-color: #fff;
  font-size: 1.25rem;

  @media (min-width: 425px) {
    width: 300px;
  }
}
.iconBeforeLabel {
  margin-right: 6px;
}
.selector {
  background-color: #fff;
  border-radius: 4px;
  border: 2px solid #ebebeb;

  & > li {
    display: flex;
    align-items: center;
    padding: 0 12px;
    line-height: 48px;
    border-top: 2px solid #ebebeb;
    font-size: 1.25rem;
    cursor: pointer;

    &:first-child {
      border-top: none;
    }
  }
}
</style>
