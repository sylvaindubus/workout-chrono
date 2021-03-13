import { OnChange } from 'property-watch-decorator'

import Step from '../types/step.d'
import ProgramState from '../types/programState'

type Timer = {
  duration: number;
  decrement: boolean;
}

type UpdateHandlers = {
  onStateUpdate: Function;
  onTimeUpdate: Function;
  onStepIndexUpdate: Function;
}

class Program {
  private prevTimestamp = 0
  public elapsedTime = 0

  @OnChange('handleStateChange')
  private state = ProgramState.Stopped

  @OnChange('handleTimeChange')
  private time = 0

  @OnChange('handleIndexChange')
  private index = -1

  private onStateUpdate: Function
  private onTimeUpdate: Function
  private onStepIndexUpdate: Function

  private timers: Array<Timer> = []

  constructor (steps: Array<Step>, updateHandlers: UpdateHandlers) {
    this.onStateUpdate = updateHandlers.onStateUpdate
    this.onTimeUpdate = updateHandlers.onTimeUpdate
    this.onStepIndexUpdate = updateHandlers.onStepIndexUpdate

    this.timers = steps.map(step => ({
      duration: step.duration * 1000,
      decrement: step.duration > 0
    }))

    if (this.timers[0]) {
      this.time = this.timers[0].duration
    }

    this.startLoop()
  }

  handleTimeChange (value: number) {
    if (this.onTimeUpdate) {
      this.onTimeUpdate(value)
    }
  }

  handleStateChange (value: number) {
    if (this.onStateUpdate) {
      this.onStateUpdate(value)
    }
  }

  handleIndexChange (value: number) {
    if (this.onStepIndexUpdate) {
      this.onStepIndexUpdate(value)
    }
  }

  start () {
    this.state = ProgramState.Running
    this.index = 0
    this.elapsedTime = 0
  }

  stop () {
    this.reset()
    this.state = ProgramState.Stopped
  }

  play () {
    if (this.state === ProgramState.Stopped || this.state === ProgramState.Finished) return
    this.state = ProgramState.Running
  }

  pause () {
    if (this.state === ProgramState.Stopped || this.state === ProgramState.Finished) return
    this.state = ProgramState.Paused
  }

  nextStep () {
    if (this.state === ProgramState.Stopped || this.state === ProgramState.Finished) return
    if (this.timers[this.index + 1]) {
      this.index++
      this.time = this.timers[this.index]?.duration || 0
    } else {
      this.reset()
      this.state = ProgramState.Finished
    }
  }

  previousStep () {
    if (this.state === ProgramState.Stopped || this.state === ProgramState.Finished) return
    if (this.timers[this.index - 1]) {
      this.index--
      this.time = this.timers[this.index]?.duration || 0
    }
  }

  private reset () {
    this.time = this.timers[0]?.duration || 0
    this.index = -1
  }

  private startLoop () {
    this.prevTimestamp = window.performance.now()
    requestAnimationFrame(this.loop.bind(this))
  }

  private loop (currentTimestamp: number) {
    const interval = currentTimestamp - this.prevTimestamp
    this.prevTimestamp = currentTimestamp
    this.updateTime(interval)
    requestAnimationFrame(this.loop.bind(this))
  }

  private updateTime (interval: number) {
    if (this.state !== ProgramState.Running) {
      return
    }

    this.elapsedTime += interval

    const timer = this.timers[this.index]
    if (timer?.decrement) {
      this.time -= interval
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
