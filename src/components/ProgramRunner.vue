<template>
  <section
    :class="classes"
    @keyup.left="handleClickOnPrevious"
    @keyup.right="handleClickOnNext"
    @keyup.space="handleClickOnStartPause"
    tabindex="0"
  >
    <div class="block totalTime" v-if="programState === ProgramState.Running || programState === ProgramState.Paused">
      <label class="totalTimeLabel">Total</label>
      <program-runner-timer :time="program.totalTime" isSmall hideCentiseconds />
    </div>
    <div class="block main">
      <div v-if="programState === ProgramState.Running || programState === ProgramState.Paused">
        <p class="title">{{ title }}</p>
        <program-runner-timer :time="time" />
        <program-runner-next-step :step="nextStep" :isVisible="isNextStepVisible" />
      </div>
      <div v-else-if="programState === ProgramState.Finished">
        <p class="title">Well done!</p>
        <p class="title">You did it in:</p>
        <program-runner-timer :time="program.totalTime" />
        <rounded-button class="endButton" @click="handleClickOnStop">Okay!</rounded-button>
      </div>
      <div v-else>
        <button class="bigPlayButton" @click="handleClickOnStartPause" aria-label="Start">
          <icon width="24" height="24"><icon-round-play /></icon>
          <div>Let's do it!</div>
        </button>
      </div>
    </div>
    <div class="block buttons" v-if="programState === ProgramState.Running || programState === ProgramState.Paused">
      <rounded-button @click="handleClickOnPrevious" aria-label="Previous step">
        <icon width="24" height="24"><icon-previous /></icon>
      </rounded-button>
      <rounded-button
        @click="handleClickOnStartPause"
        :aria-label="programState === ProgramState.Running ? 'Pause' : 'Start'"
      >
        <icon width="24" height="24" v-if="programState === ProgramState.Running"><icon-pause /></icon>
        <icon width="24" height="24" v-else><icon-play /></icon>
      </rounded-button>
      <rounded-button @click="handleClickOnNext" aria-label="Next step">
        <icon width="24" height="24"><icon-next /></icon>
      </rounded-button>
    </div>
    <rounded-button
      class="stopButton"
      @click="handleClickOnStop"
      v-if="programState === ProgramState.Paused"
      aria-label="Stop workout"
    >
      <icon width="24" height="24"><icon-stop /></icon>
      <span>Stop</span>
    </rounded-button>
    <program-runner-progress :steps="workout.steps" :currentStep="currentStep" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Workout from '../types/workout.d'
import Step from '../types/step.d'
import ProgramState from '../types/programState'
import Program from '../libs/Program'
import ProgramRunnerTimer from './ProgramRunnerTimer.vue'
import ProgramRunnerProgress from './ProgramRunnerProgress.vue'
import ProgramRunnerNextStep from './ProgramRunnerNextStep.vue'
import RoundedButton from './RoundedButton.vue'
import Icon from './icons/Icon.vue'
import IconRoundPlay from './icons/IconRoundPlay.vue'
import IconPrevious from './icons/IconPrevious.vue'
import IconNext from './icons/IconNext.vue'
import IconPlay from './icons/IconPlay.vue'
import IconPause from './icons/IconPause.vue'
import IconStop from './icons/IconStop.vue'
import StepType from '@/types/stepType'
/* global WakeLockSentinel */

let wakeLock: WakeLockSentinel | null

export default defineComponent({
  name: 'ProgramRunner',
  components: {
    ProgramRunnerTimer,
    ProgramRunnerProgress,
    ProgramRunnerNextStep,
    RoundedButton,
    Icon,
    IconRoundPlay,
    IconPrevious,
    IconNext,
    IconPlay,
    IconPause,
    IconStop,
  },
  props: {
    workout: { type: Object as () => Workout, required: true },
    isMute: { type: Boolean },
  },
  data() {
    const program = new Program(this.workout.steps, {
      onStateUpdate: this.handleStateUpdate as (v: number) => void,
      onTimeUpdate: this.handleTimeUpdate as (v: number) => void,
      onStepIndexUpdate: this.handleStepIndexUpdate as (v: number) => void,
      onElapsingUpdate: this.handleElapsingUpdate as (v: boolean) => void,
    })

    const countdown = new Audio('countdown.mp3')
    countdown.muted = this.isMute
    countdown.addEventListener('ended', function () {
      this.currentTime = 0
    })

    return {
      time: 0,
      stepIndex: -1,
      program: program,
      programState: ProgramState.Stopped,
      ProgramState: ProgramState,
      countdown: countdown,
    }
  },
  watch: {
    workout: {
      handler: function (newWorkout: Workout) {
        this.program.stop()
        // Replace the current program with a new one, using new steps
        this.program = new Program(newWorkout.steps, {
          onStateUpdate: this.handleStateUpdate,
          onTimeUpdate: this.handleTimeUpdate,
          onStepIndexUpdate: this.handleStepIndexUpdate,
          onElapsingUpdate: this.handleElapsingUpdate,
        })
      },
      deep: true,
    },
    isMute: {
      handler: function (isMute: boolean) {
        this.countdown.muted = isMute
      },
    },
  },
  computed: {
    classes(): Array<string> {
      const classes = ['programRunner']
      const step = this.workout.steps[this.stepIndex]
      if (step) {
        classes.push(`${step.type.toLowerCase()}Color`)
      }
      return classes
    },
    title(): string {
      const step = this.workout.steps[this.stepIndex]
      if (step) {
        return step.name ? step.name : step.type
      } else {
        return ''
      }
    },
    currentStep(): Step | null {
      return this.workout.steps[this.stepIndex] || null
    },
    nextStep(): Step | null {
      return this.workout.steps[this.stepIndex + 1] || null
    },
    isNextStepVisible(): boolean {
      // The next step should be visible if this is a exercise step
      // and if the current step is almost done (less than 20 seconds left)
      return (
        this.nextStep !== null &&
        this.nextStep.type === StepType.Exercise &&
        this.currentStep !== null &&
        ((this.currentStep.duration > 0 && this.time < 20000) || this.currentStep.duration === 0)
      )
    },
  },
  methods: {
    handleTimeUpdate(time: number) {
      this.time = time
    },
    handleStepIndexUpdate(index: number) {
      this.stepIndex = index
    },
    handleStateUpdate(state: ProgramState) {
      this.programState = state

      if (state === ProgramState.Running && !wakeLock) {
        this.requestWakeLock()
      } else if ((state === ProgramState.Stopped || state === ProgramState.Finished) && wakeLock) {
        this.releaseWakeLock()
      }
    },
    handleElapsingUpdate(elapsing: boolean) {
      if (elapsing) {
        this.countdown.currentTime = Math.max(0, this.countdown.duration - this.time)
        this.countdown.play()
      }
    },
    handleClickOnStartPause() {
      if (this.programState === ProgramState.Running) {
        this.program.pause()
        if (!this.countdown.paused && this.countdown.currentTime > 0) {
          this.countdown.pause()
        }
      } else if (this.programState === ProgramState.Paused) {
        this.program.play()
        if (this.countdown.paused && this.countdown.currentTime > 0) {
          this.countdown.currentTime = Math.max(0, this.countdown.duration - this.time)
          this.countdown.play()
        }
      } else {
        this.program.start()
      }
    },
    handleClickOnStop() {
      this.stopCountdown()
      this.program.stop()
    },
    handleClickOnPrevious() {
      this.stopCountdown()
      this.program.previousStep()
    },
    handleClickOnNext() {
      this.stopCountdown()
      this.program.nextStep()
    },
    stopCountdown() {
      if (!this.countdown.paused) {
        this.countdown.pause()
      }
      this.countdown.currentTime = 0
    },
    async requestWakeLock() {
      wakeLock = await navigator.wakeLock.request('screen')
    },
    async releaseWakeLock() {
      if (!wakeLock) return
      wakeLock.release()
      wakeLock = null
    },
  },
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
  transition: background-color ease 0.75s, color ease 0.75s;

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
  &.totalTime {
    top: 80px;
  }
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
.totalTimeLabel {
  font-size: 1.25rem;
}
.bigPlayButton {
  flex-direction: column;
  width: 240px;
  height: 240px;
  background: transparent;
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
