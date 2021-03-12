<template>
  <section :class="classes">
    <div>
      <select class="typeSelect" :value="step.type" name="type" @change="handleUpdate($event)">
        <option v-for="type of stepTypes" :value="type.value" :key="type.value">{{ type.label }}</option>
      </select>
      <div>
        <input type="number" class="timeInput" min="0" max="60" step="1" :value="minutes" name="minutes" @change="handleUpdate($event)" /> :
        <input type="number" class="timeInput" min="0" max="60" step="5" :value="seconds" name="seconds" @change="handleUpdate($event)" />
      </div>
      <input class="nameInput" v-if="step.type === StepType.Exercise" :value="step.name" name="name" @change="handleUpdate($event)" />
    </div>
    <div class="buttons">
      <button class="button" @click="handleClickOnMoveUpButton" :disabled="isFirst" aria-label="Move step upward">
        <icon width=24 height=24><icon-arrow-up /></icon>
      </button>
      <button class="button" @click="handleClickOnMoveDownButton" :disabled="isLast" aria-label="Move step downward">
        <icon width=24 height=24><icon-arrow-down /></icon>
      </button>
      <button class="button" @click="handleStepDelete" aria-label="Delete step">
        <icon width=24 height=24><icon-trash /></icon>
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
import IconArrowUp from './icons/IconArrowUp.vue'
import IconArrowDown from './icons/IconArrowDown.vue'

export default defineComponent({
  name: 'ProgramBuilderStep',
  components: {
    Icon,
    IconTrash,
    IconArrowUp,
    IconArrowDown
  },
  props: {
    step: { type: Object, required: true },
    isFirst: Boolean,
    isLast: Boolean
  },
  data () {
    return {
      StepType
    }
  },
  computed: {
    classes (): Array<string> {
      return [
        'programBuilderStep',
        `${this.step.type.toLowerCase()}Color`
      ]
    },
    stepTypes (): Array<{ value: string; label: string | StepType }> {
      return (Object.entries(StepType).map(([label, value]) => ({ value, label })))
    },
    minutes (): string {
      return formatMinutes(this.step.duration)
    },
    seconds (): string {
      return formatSeconds(this.step.duration)
    }
  },
  methods: {
    handleUpdate (event: InputEvent) {
      const { name, value } = event.currentTarget as HTMLInputElement
      switch (name) {
        case 'minutes':
          this.$emit('update', this.step.id, { duration: parseInt(value) * 60 + this.step.duration % 60 })
          break
        case 'seconds':
          this.$emit('update', this.step.id, { duration: Math.floor(this.step.duration / 60) * 60 + parseInt(value) })
          break
        case 'type':
          this.$emit('update', this.step.id, { [name]: value })
          break
        default:
          this.$emit('update', this.step.id, { [name]: value })
      }
    },
    handleStepDelete () {
      this.$emit('delete', this.step.id)
    },
    handleClickOnMoveUpButton () {
      this.$emit('up', this.step.id)
    },
    handleClickOnMoveDownButton () {
      this.$emit('down', this.step.id)
    }
  }
})
</script>

<style lang="postcss" scoped>
  .programBuilderStep {
    display: flex;
    justify-content: space-between;
    border-left: 6px solid;
    background-color: #778ca3;
    padding: 12px;
    border-radius: 4px;

    &.warmupColor {
      border-color: #f7b731;
      background-color: #fed330;
      & .button {
        background-color: #f7b731;
      }
    }

    &.exerciseColor {
      border-color: #eb3b5a;
      background-color: #fc5c65;
      & .button {
        background-color: #eb3b5a;
      }
    }

    &.restColor {
      border-color: #2d98da;
      background-color: #45aaf2;
      & .button {
        background-color: #2d98da;
      }
    }

    &.stretchingColor {
      border-color: #20bf6b;
      background-color: #26de81;
      & .button {
        background-color: #20bf6b;
      }
    }
  }
  select, input {
    border: none;
    height: 36px;
    margin-bottom: 6px;
    padding: 6px;
    border-radius: 4px;
    border: 2px solid #d1d8e0;
    background-color: #fff;
    font-weight: 700;
  }
  .typeSelect,
  .nameInput {
    width: 180px;
  }
  .timeInput {
    width: 50px;
    padding: 5px;
  }
  .buttons {
    text-align: right;
  }
  .button {
    width: 36px;
    height: 36px;
    margin: 3px;
    padding: 0;
    border: none;
    border-radius: 50%;
    outline: none;
  }
</style>
