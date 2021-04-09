<template>
  <section class="workoutManager">
    <!-- <label class="label">Current workout</label> -->
    <div class="title" v-if="!isRenaming" @click=toggleSelect>
      <button class="switchButton" aria-label="Select another workout">
        <icon width=32 height=32><icon-caret-down /></icon>
      </button>
      <span>{{name}}</span>
    </div>
    <ul class="selector" v-if="isSelecting">
      <li v-for="w of workouts" :key="w.id" @click="selectWorkout(w.id)">{{ w.name }}</li>
      <li @click="createWorkout">
        <icon width=32 height=32 class="iconBeforeLabel"><icon-add-circle /></icon>
        <span>New workout</span>
      </li>
    </ul>
    <div v-if="isRenaming">
      <input :value="name" class="nameInput" @change="handleNameUpdate($event)" />
    </div>
    <div v-if="isRenaming">
      <rounded-button class="actionButton confirmColor" @click="renameWorkout">
        <icon width=24 height=24 class="iconBeforeLabel"><icon-check /></icon>
        <span>Rename</span>
      </rounded-button>
      <rounded-button class="actionButton cancelColor" @click="cancelRenaming">
        <icon width=24 height=24 class="iconBeforeLabel"><icon-close /></icon>
        <span>Forget it</span>
      </rounded-button>
    </div>
    <div v-if="isDeleting">
      <p class="question">Are you sure buddy?</p>
      <rounded-button class="actionButton confirmColor" @click="deleteWorkout">
        <icon width=24 height=24 class="iconBeforeLabel"><icon-check /></icon>
        <span>Delete</span>
      </rounded-button>
      <rounded-button class="actionButton cancelColor" @click="cancelDeleting">
        <icon width=24 height=24 class="iconBeforeLabel"><icon-close /></icon>
        <span>Forget it</span>
      </rounded-button>
    </div>
    <div v-if="!isSelecting && !isRenaming && !isDeleting">
      <rounded-button class="actionButton" @click="toggleRename">
        <icon width=24 height=24 class="iconBeforeLabel"><icon-edit /></icon>
        <span>Rename</span>
      </rounded-button>
      <rounded-button class="actionButton" @click="toggleDelete" v-if="workouts.length > 1">
        <icon width=24 height=24 class="iconBeforeLabel"><icon-trash /></icon>
        <span>Delete</span>
      </rounded-button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    IconTrash
  },
  props: {
    workout!: { type: Object, required: true },
    workouts!: { type: Array, required: true }
  },
  methods: {
    toggleSelect () {
      this.isSelecting = !this.isSelecting
      if (this.isSelecting && this.isDeleting) {
        this.isDeleting = false
      }
    },
    selectWorkout (id: string) {
      this.$emit('select-workout', id)
      this.isSelecting = false
    },
    createWorkout () {
      this.$emit('create-workout')
      this.isSelecting = false
    },
    toggleRename () {
      this.isRenaming = !this.isRenaming
    },
    toggleDelete () {
      this.isDeleting = !this.isDeleting
    },
    renameWorkout () {
      this.$emit('rename-workout', this.name)
      this.isRenaming = false
    },
    cancelRenaming () {
      this.name = this.workout.name
      this.isRenaming = false
    },
    deleteWorkout () {
      this.$emit('delete-workout')
      this.isDeleting = false
    },
    cancelDeleting () {
      this.isDeleting = false
    },
    handleNameUpdate (event: InputEvent) {
      const { value } = event.currentTarget as HTMLInputElement
      this.name = value
    }
  },
  data () {
    return {
      name: this.workout.name,
      isSelecting: false,
      isRenaming: false,
      isDeleting: false
    }
  },
  watch: {
    workout () {
      this.name = this.workout.name
    }
  }
})
</script>

<style lang="postcss" scoped>
  .workoutManager {
    margin-bottom: 18px;
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
  .title {
    display: flex;
    line-height: 42px;
    align-items: flex-start;
    margin-bottom: 18px;
    font-size: 1.75rem;
    font-weight: 700;
    cursor: pointer;
    max-width: 300px;
  }
  .switchButton {
    display: flex;
    margin: 6px 6px 0 0;
    border: none;
    background: none;
    color: inherit;
  }
  .question {
    margin-bottom: 12px;
    font-size: 1.25rem;
    font-weight: 700;
  }
  .nameInput {
    border: none;
    width: 300px;
    max-width: 100%;
    height: 48px;
    margin: 0 6px 12px 0;
    padding: 12px;
    border-radius: 4px;
    border: 2px solid #ebebeb;
    background-color: #fff;
    font-weight: 700;
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
      font-weight: 700;
      cursor: pointer;

      &:first-child {
        border-top: none;
      }
    }
  }
</style>
