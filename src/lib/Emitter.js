export default class Emitter {
    constructor(interval, emitFn) {
        this.interval = interval
        this.emitFn   = emitFn
    }

    tick(time) {
        if (time % this.interval === 0) this.emitFn()
    }
}
