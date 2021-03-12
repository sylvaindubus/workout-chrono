import { OnChange } from 'property-watch-decorator'

import Step from '../types/step.d'

type Timer = {
  duration: number;
  decrement: boolean;
}

class Program {
  private prevTimestamp = 0
  public started = false
  public running = false
  public done = false
  public elapsedTime = 0

  @OnChange('handleTimeChange')
  private time = 0

  @OnChange('handleIndexChange')
  private index = -1

  public timers: Array<Timer> = []

  constructor (steps: Array<Step>, private onTimeUpdate: Function, private onStepIndexUpdate: Function) {
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

  handleIndexChange (value: number) {
    if (this.onStepIndexUpdate) {
      this.onStepIndexUpdate(value)
    }
  }

  start () {
    this.started = true
    this.running = true
    this.index = 0
    this.elapsedTime = 0
  }

  stop () {
    this.reset()
    this.done = false
  }

  play () {
    if (!this.started) return
    this.running = true
  }

  pause () {
    if (!this.started) return
    this.running = false
  }

  nextStep () {
    if (!this.started) return
    if (this.timers[this.index + 1]) {
      this.index++
      this.time = this.timers[this.index]?.duration || 0
    } else {
      this.reset()
      this.done = true
    }
  }

  previousStep () {
    if (!this.started) return
    if (this.timers[this.index - 1]) {
      this.index--
      this.time = this.timers[this.index]?.duration || 0
    }
  }

  private reset () {
    this.started = false
    this.running = false
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
    if (!this.running) {
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
