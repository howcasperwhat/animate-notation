export default class StrokeAnimator {
  private path: SVGPathElement
  public readonly length: number
  private trace: number
  private startTime: number = -1
  private duration: number = 0
  private process: 'paint' | 'erase' | 'listen' | 'freeze' = 'freeze'

  private painted: () => void = this.listen
  private erased: () => void = this.listen

  public constructor(
    path: SVGPathElement,
    trace: number = -1,
    start: boolean = false
  ) {
    this.path = path
    this.length = path.getTotalLength()
    this.trace = this.clacInitTrace(trace)
    this.path.style.strokeDasharray = `${this.length}px`
    this.path.style.strokeDashoffset = `${this.length - this.trace}px`
    start && this.start()
  }

  private done() {
    if (this.process === 'paint' && this.trace >= this.length) return true
    if (this.process === 'erase' && this.trace <= 0) return true
    return false
  }

  private clacInitTrace(trace: number) {
    if (trace === -1) return this.length
    return trace
  }

  private update() {
    this.trace = Math.min(this.trace, this.length)
    this.trace = Math.max(this.trace, 0)
    let offset = this.length - this.trace
    this.path.style.strokeDashoffset = `${offset}px`
  }

  private initStartTime(currentTime: number) {
    if (this.startTime === -1)
      this.startTime = currentTime
  }

  private calcStep(currentTime: number, previousTime: number) {
    if (this.duration === 0) return this.length
    const rate = (currentTime - previousTime) / this.duration
    if (rate >= 1) return this.length
    return this.length * rate
  }

  private _paint(currentTime: number, previousTime?: number) {
    // startTime will be updated only when previousTime === undefined
    this.initStartTime(currentTime)
    const step = this.calcStep(currentTime, previousTime ?? this.startTime)
    this.trace += step
    this.update()
    this.done() && this.painted()
    this._listen(currentTime)
  }

  private _erase(currentTime: number, previousTime?: number) {
    // startTime will be updated only when previousTime === undefined
    this.initStartTime(currentTime)
    const step = this.calcStep(currentTime, previousTime ?? this.startTime)
    this.trace -= step
    this.update()
    this.done() && this.erased()
    this._listen(currentTime)
  }

  private _listen(previousTime?: number) {
    requestAnimationFrame((currentTime) => {
      switch (this.process) {
        case 'paint':
          this._paint(currentTime, previousTime)
          break
        case 'erase':
          this._erase(currentTime, previousTime)
          break
        case 'listen':
          this._listen(currentTime)
          break
        default: break
      }
    })
  }

  public paint(duration: number, initTrace: number = this.trace) {
    this.duration = duration
    this.process = 'paint'
    this.startTime = -1
    this.trace = this.clacInitTrace(initTrace)
  }

  public erase(duration: number, initTrace: number = this.trace) {
    this.duration = duration
    this.process = 'erase'
    this.startTime = -1
    this.trace = this.clacInitTrace(initTrace)
  }

  public stop() {
    this.process = 'freeze'
    this.startTime = -1
  }

  public listen() {
    this.process = 'listen'
    this.startTime = -1
  }

  public start() {
    if (this.process !== 'freeze') return
    this.process = 'listen'
    this._listen()
  }

  public onPainted(fn: () => void) {
    this.painted = () => {
      this.listen()
      fn()
    }
  }

  public onErased(fn: () => void) {
    this.erased = () => {
      this.listen()
      fn()
    }
  }
}