<template>
  <section
    :class="classes"
    @keyup.left="handleClickOnPrevious"
    @keyup.right="handleClickOnNext"
    @keyup.space="handleClickOnStartPause"
    tabindex="0">
    <div class="block main">
      <div v-if="program.started">
        <p class="title">{{ title }}</p>
        <program-runner-timer :time="time" />
      </div>
      <div v-else-if="program.done">
        <p class="title">Well done!</p>
        <p class="title">You did it in:</p>
        <program-runner-timer :time="program.elapsedTime" />
        <rounded-button class="endButton" @click="handleClickOnStop">Okay!</rounded-button>
      </div>
      <div v-else>
        <button class="bigPlayButton" @click="handleClickOnStartPause">
          <icon width=24 height=24><icon-round-play /></icon>
          <div>Let's do it!</div>
        </button>
      </div>
    </div>
    <div class="block buttons" v-if="program.started">
      <rounded-button @click="handleClickOnPrevious">
        <icon width=24 height=24><icon-previous /></icon>
      </rounded-button>
      <rounded-button @click="handleClickOnStartPause">
        <icon width=24 height=24 v-if="program.running"><icon-pause /></icon>
        <icon width=24 height=24 v-else><icon-play /></icon>
      </rounded-button>
      <rounded-button @click="handleClickOnNext">
        <icon width=24 height=24><icon-next /></icon>
      </rounded-button>
    </div>
    <rounded-button class="stopButton" @click="handleClickOnStop" v-if="program.started && !program.running">
      <icon width=24 height=24><icon-stop /></icon>
      <span>Stop</span>
    </rounded-button>
    <program-runner-progress :steps="workout.steps" :currentStep="currentStep" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Workout from '../types/workout.d'
import Step from '../types/step.d'
import Program from '../libs/Program'
import ProgramRunnerTimer from './ProgramRunnerTimer.vue'
import ProgramRunnerProgress from './ProgramRunnerProgress.vue'
import RoundedButton from './RoundedButton.vue'
import Icon from './icons/Icon.vue'
import IconRoundPlay from './icons/IconRoundPlay.vue'
import IconPrevious from './icons/IconPrevious.vue'
import IconNext from './icons/IconNext.vue'
import IconPlay from './icons/IconPlay.vue'
import IconPause from './icons/IconPause.vue'
import IconStop from './icons/IconStop.vue'

export default defineComponent({
  name: 'ProgramRunner',
  components: {
    ProgramRunnerTimer,
    ProgramRunnerProgress,
    RoundedButton,
    Icon,
    IconRoundPlay,
    IconPrevious,
    IconNext,
    IconPlay,
    IconPause,
    IconStop
  },
  props: {
    workout!: { type: Object as () => Workout, required: true }
  },
  data () {
    const program = new Program(this.workout.steps, this.handleTimeUpdate, this.handleStepIndexUpdate)
    return {
      time: 0,
      stepIndex: -1,
      program: program,
      done: false
    }
  },
  watch: {
    workout: {
      handler: function (newWorkout: Workout) {
        this.program.stop()
        // Replace the current program with a new one, using new steps
        this.program = new Program(newWorkout.steps, this.handleTimeUpdate, this.handleStepIndexUpdate)
      },
      deep: true
    }
  },
  computed: {
    classes (): Array<string> {
      const classes = ['programRunner']
      const step = this.workout.steps[this.stepIndex]
      if (step) {
        classes.push(`${step.type.toLowerCase()}Color`)
      }
      return classes
    },
    title (): string {
      const step = this.workout.steps[this.stepIndex]
      if (step) {
        return step.name ? step.name : step.type
      } else {
        return ''
      }
    },
    currentStep (): Step | null {
      return this.workout.steps[this.stepIndex]
    },
    isRunning (): boolean {
      return this.program.running
    }
  },
  methods: {
    handleTimeUpdate (time: number) {
      this.time = time
    },
    handleStepIndexUpdate (index: number) {
      this.stepIndex = index
    },
    handleCompletionChange (done: boolean) {
      this.done = done
    },
    handleClickOnStartPause () {
      if (this.program.running) {
        this.program.pause()
      } else if (this.program.started) {
        this.program.play()
      } else {
        this.program.start()
      }
    },
    handleClickOnStop () {
      this.program.stop()
    },
    handleClickOnPrevious () {
      this.program.previousStep()
    },
    handleClickOnNext () {
      this.program.nextStep()
    }
  }
})
</script>

<style lang="postcss" scoped>
  .programRunner {
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    background-color: #f1f1f1;
    transition: background-color ease .75s, color ease .75s;

    &.warmupColor {
      background-color: #fed330;
    }

    &.exerciseColor {
      background-color: #fc5c65;
      color: #fff;
    }

    &.restColor {
      background-color: #45aaf2;
      color: #fff;
    }

    &.stretchingColor {
      background-color: #26de81;
      color: #fff;
    }
  }
  .block {
    position: absolute;
    padding: 18px;
    font-size: 2rem;

    &.main {
      top: 50%;
      transform: translateY(-50%);
    }
    &.buttons {
      width: 100%;
      bottom: 18px;

      & > * {
        margin: 0 6px;
      }
    }
  }
  .title {
    margin-bottom: 12px;
  }
  .bigPlayButton {
    border: none;
    width: 240px;
    height: 240px;
    background: transparent;
    font-weight: 700;
    color: #4b6584;
    text-transform: uppercase;

    & > svg {
      width: 50%;
      height: 50%;
    }
  }
  .stopButton {
    position: absolute;
    left: 18px;
    top: 18px;
    color: #eb3b5a;

    & > svg {
      margin-right: 3px;
    }
  }
  .endButton {
    margin-top: 24px;
  }
</style>
