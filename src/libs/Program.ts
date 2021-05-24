import { OnChange } from 'property-watch-decorator'

import Step from '../types/step.d'
import ProgramState from '../types/programState'

type Timer = {
  duration: number;
  decrement: boolean;
}

type UpdateHandlers = {
  onStateUpdate: (v: number) => void;
  onTimeUpdate: (v: number) => void;
  onStepIndexUpdate: (v: number) => void;
  onElapsingUpdate: (v: boolean) => void;
}

// Time from which we consider the current step to be elapsing
// This value is matching with the countdown sound (not ideal way to deal with it)
const startElapsingAt = 5200

class Program {
  private prevTimestamp = 0
  public totalTime = 0
  public elapsing = false

  @OnChange('handleStateChange')
  private state = ProgramState.Stopped

  @OnChange('handleTimeChange')
  private time = 0

  @OnChange('handleIndexChange')
  private index = -1

  private onStateUpdate: (v: number) => void
  private onTimeUpdate: (v: number) => void
  private onStepIndexUpdate: (v: number) => void
  private onElapsingUpdate: (v: boolean) => void

  private timers: Array<Timer> = []

  constructor(steps: Array<Step>, updateHandlers: UpdateHandlers) {
    this.onStateUpdate = updateHandlers.onStateUpdate
    this.onTimeUpdate = updateHandlers.onTimeUpdate
    this.onStepIndexUpdate = updateHandlers.onStepIndexUpdate
    this.onElapsingUpdate = updateHandlers.onElapsingUpdate

    this.timers = steps.map(step => ({
      duration: step.duration * 1000,
      decrement: step.duration > 0,
    }))

    if (this.timers[0]) {
      this.time = this.timers[0].duration
    }

    this.startLoop()
  }

  handleTimeChange(value: number): void {
    if (this.onTimeUpdate) {
      this.onTimeUpdate(value)
    }
  }

  handleStateChange(value: number): void {
    if (this.onStateUpdate) {
      this.onStateUpdate(value)
    }
  }

  handleIndexChange(value: number): void {
    if (this.onStepIndexUpdate) {
      this.onStepIndexUpdate(value)
    }
  }

  handleElapsingChange(value: boolean): void {
    this.elapsing = value
    if (this.onElapsingUpdate) {
      this.onElapsingUpdate(value)
    }
  }

  start(): void {
    this.state = ProgramState.Running
    this.index = 0
    this.totalTime = 0
  }

  stop(): void {
    this.reset()
    this.state = ProgramState.Stopped
  }

  play(): void {
    if (this.state === ProgramState.Stopped || this.state === ProgramState.Finished) return
    this.state = ProgramState.Running
  }

  pause(): void {
    if (this.state === ProgramState.Stopped || this.state === ProgramState.Finished) return
    this.state = ProgramState.Paused
  }

  nextStep(): void {
    if (this.state === ProgramState.Stopped || this.state === ProgramState.Finished) return
    if (this.timers[this.index + 1]) {
      this.index++
      this.time = this.timers[this.index]?.duration || 0
    } else {
      this.reset()
      this.state = ProgramState.Finished
    }

    if (this.elapsing) {
      this.handleElapsingChange(false)
    }
  }

  previousStep(): void {
    if (this.state === ProgramState.Stopped || this.state === ProgramState.Finished) return
    if (this.timers[this.index - 1]) {
      this.index--
      this.time = this.timers[this.index]?.duration || 0
    }

    if (this.elapsing) {
      this.handleElapsingChange(false)
    }
  }

  private reset() {
    this.time = this.timers[0]?.duration || 0
    this.index = -1
    this.elapsing = false
  }

  private startLoop() {
    this.prevTimestamp = window.performance.now()
    requestAnimationFrame(this.loop.bind(this))
  }

  private loop(currentTimestamp: number) {
    const interval = currentTimestamp - this.prevTimestamp
    this.prevTimestamp = currentTimestamp
    this.updateTime(interval)
    requestAnimationFrame(this.loop.bind(this))
  }

  private updateTime(interval: number) {
    if (this.state !== ProgramState.Running) {
      return
    }

    this.totalTime += interval

    const timer = this.timers[this.index]
    if (timer?.decrement) {
      this.time -= interval
      if (!this.elapsing && this.time < startElapsingAt) {
        this.handleElapsingChange(true)
      }
      if (this.time < 0) {
        this.time = 0
        this.nextStep()
      }
    } else {
      this.time += interval
    }
  }
}

export default Program
