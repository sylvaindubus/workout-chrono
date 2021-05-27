<template>
  <section :class="classes">
    <div v-if="isEditing" class="inner">
      <label aria-label="Type">
        <select class="typeSelect" :value="step.type" name="type" @change="handleUpdate($event)">
          <option v-for="type of stepTypes" :value="type.value" :key="type.value">
            {{ type.label }}
          </option>
        </select>
      </label>
      <label v-if="step.type === StepType.Exercise" aria-label="Name">
        <input class="nameInput" :value="step.name" name="stepName" @change="handleUpdate($event)" />
      </label>
      <div>
        <label aria-label="Minutes">
          <input
            type="number"
            class="timeInput"
            min="0"
            max="60"
            step="1"
            :value="minutes"
            name="minutes"
            @change="handleUpdate($event)"
          />
          :
        </label>
        <label aria-label="Seconds">
          <input
            type="number"
            class="timeInput"
            min="0"
            max="60"
            step="5"
            :value="seconds"
            name="seconds"
            @change="handleUpdate($event)"
          />
        </label>
      </div>
    </div>
    <div v-else class="inner">
      <p>{{ step.type }}</p>
      <p v-if="step.name">{{ step.name }}</p>
      <p v-if="minutes > 0 || seconds > 0" class="time">{{ minutes }}:{{ seconds }}</p>
      <p v-else class="noTimeLimitInfo">No timer</p>
    </div>
    <button class="editButton" @click="toggleEdit" :aria-label="isEditing ? 'Stop editing step' : 'Edit step'">
      <icon width="24" height="24">
        <icon-check v-if="isEditing" />
        <icon-edit v-else />}
      </icon>
    </button>
    <div class="buttons" v-if="isEditing">
      <button @click="handleClickOnMoveUpButton" :disabled="isFirst" aria-label="Move step upward">
        <icon width="28" height="28"><icon-arrow-up /></icon>
      </button>
      <button @click="handleClickOnMoveDownButton" :disabled="isLast" aria-label="Move step downward">
        <icon width="28" height="28"><icon-arrow-down /></icon>
      </button>
      <button @click="handleStepClone" aria-label="Clone step">
        <icon width="28" height="28"><icon-copy /></icon>
      </button>
      <button @click="handleStepDelete" aria-label="Delete step">
        <icon width="28" height="28"><icon-trash /></icon>
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import StepType from '../types/stepType'
import { formatMinutes, formatSeconds } from '../helpers/formatters'
import Icon from './icons/Icon.vue'
import IconTrash from './icons/IconTrash.vue'
import IconCopy from './icons/IconCopy.vue'
import IconArrowUp from './icons/IconArrowUp.vue'
import IconArrowDown from './icons/IconArrowDown.vue'
import IconEdit from './icons/IconEdit.vue'
import IconCheck from './icons/IconCheck.vue'

export default defineComponent({
  name: 'ProgramBuilderStep',
  components: {
    Icon,
    IconTrash,
    IconCopy,
    IconArrowUp,
    IconArrowDown,
    IconEdit,
    IconCheck,
  },
  props: {
    step: { type: Object, required: true },
    isFirst: Boolean,
    isLast: Boolean,
  },
  data() {
    return {
      isEditing: this.step.isNew,
      StepType,
    }
  },
  computed: {
    classes(): Array<string> {
      return ['programBuilderStep', `${this.step.type.toLowerCase()}Color`]
    },
    stepTypes(): Array<{ value: string; label: string | StepType }> {
      return Object.entries(StepType).map(([label, value]) => ({
        value,
        label,
      }))
    },
    minutes(): string {
      return formatMinutes(this.step.duration)
    },
    seconds(): string {
      return formatSeconds(this.step.duration)
    },
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing
    },
    handleUpdate(event: InputEvent) {
      const { name, value } = event.currentTarget as HTMLInputElement
      switch (name) {
        case 'minutes':
          this.$emit('update', this.step.id, {
            duration: parseInt(value) * 60 + (this.step.duration % 60),
          })
          break
        case 'seconds':
          this.$emit('update', this.step.id, {
            duration: Math.floor(this.step.duration / 60) * 60 + parseInt(value),
          })
          break
        case 'type':
          this.$emit('update', this.step.id, {
            [name]: value,
            // Keep the step name only if the step is an exercise
            name: value === StepType.Exercise ? this.step.name : '',
          })
          break
        case 'stepName':
          this.$emit('update', this.step.id, { name: value })
          break
        default:
          this.$emit('update', this.step.id, { [name]: value })
      }
    },
    handleStepClone() {
      this.$emit('clone', this.step.id)
    },
    handleStepDelete() {
      this.$emit('delete', this.step.id)
    },
    handleClickOnMoveUpButton() {
      this.$emit('up', this.step.id)
    },
    handleClickOnMoveDownButton() {
      this.$emit('down', this.step.id)
    },
  },
})
</script>

<style lang="postcss" scoped>
.programBuilderStep {
  position: relative;
  border-left: 9px solid;
  background-color: #ebf1f5;
  padding: 12px;
  border-radius: 4px;

  &.warmupColor {
    border-color: #f7b731;
  }

  &.exerciseColor {
    border-color: #eb3b5a;
  }

  &.restColor {
    border-color: #2d98da;
  }

  &.stretchingColor {
    border-color: #20bf6b;
  }
}
.inner {
  width: calc(100% - 52px);
  font-weight: 700;
}
.time {
  margin-top: 0.5em;
}
.noTimeLimitInfo {
  margin-top: 0.5em;
  font-style: italic;
}
.typeSelect,
.nameInput {
  width: 180px;
  margin: 6px 0;

  @media (min-width: 425px) {
    width: 240px;
  }
}
.timeInput {
  margin: 6px 0;
  text-align: center;
}
.buttons {
  display: flex;
  justify-content: space-evenly;
  margin: 12px -12px -12px;

  & > * {
    flex-grow: 1;
    background-color: #fafcfd;
    border: none;
    border-left: 1px solid #ebebeb;
    border-bottom: 4px solid #ebebeb;
    padding: 0.5em;

    &:first-child {
      border-left: none;
    }

    &:disabled {
      background-color: #f5f9fb;
    }
  }
}
.editButton {
  position: absolute;
  right: 0;
  top: 0;
  width: 42px;
  height: 42px;
  margin: 12px;
  padding: 0;
  background-color: #fafcfd;
  box-shadow: #ebebeb 0px 4px 0px;
}
</style>
