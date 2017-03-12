const ONE_MISSILE = [
    {
        position: { x: 0, y:  0 },
        vector:   { x: 0, y: -8 },
    },
]

const TWO_MISSILES = [
    {
        position: { x: -25, y:  0 },
        vector:   { x:   0, y: -8 },
    },
    {
        position: { x: 25, y:  0 },
        vector:   { x:  0, y: -8 },
    },
]

const THREE_MISSILES = [
    {
        position: { x: 0, y:  0 },
        vector:   { x: 0, y: -8 },
    },
    {
        position: { x: -20, y:  0 },
        vector:   { x:  -3, y: -8 },
    },
    {
        position: { x: 20, y:  0 },
        vector:   { x:  3, y: -8 },
    },
]

const FOUR_MISSILES = [
    {
        position: { x: 0, y:  0 },
        vector:   { x: 0, y: -8 },
    },
    {
        position: { x: 0, y: 0 },
        vector:   { x: 0, y: 8 },
    },
    {
        position: { x: -20, y:  0 },
        vector:   { x:  -3, y: -8 },
    },
    {
        position: { x: 20, y:  0 },
        vector:   { x:  3, y: -8 },
    },
]

const FIVE_MISSILES = [
    {
        position: { x: 0, y:  0 },
        vector:   { x: 0, y: -8 },
    },
    {
        position: { x: -25, y: 0 },
        vector:   { x:   0, y: 8 },
    },
    {
        position: { x: 25, y: 0 },
        vector:   { x:  0, y: 8 },
    },
    {
        position: { x: -20, y:  0 },
        vector:   { x:  -3, y: -8 },
    },
    {
        position: { x: 20, y:  0 },
        vector:   { x:  3, y: -8 },
    },
]

const configs = [
    ONE_MISSILE,    // level 1
    TWO_MISSILES,   // level 2
    THREE_MISSILES, // level 3
    FOUR_MISSILES,  // level 4
    FIVE_MISSILES,  // level 5
]

export const MAX_MISSILES_LEVEL = configs.length

const MISSILES_EMIT_INTERVAL = 30

export class MissilesEmitter {
    constructor(emit) {
        this.emit   = emit
        this.config = null
    }

    set level(level) {
        if (level === 0) {
            this.config = null
        } else {
            this.config = configs[Math.min(level - 1, configs.length - 1)]
        }
    }

    tick(time) {
        if (this.config !== null && time % MISSILES_EMIT_INTERVAL === 0) this.emit(this.config)
    }
}