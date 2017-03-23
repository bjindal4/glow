const ONE_MISSILE = [
    {
        position: { x: 0, y:  0  },
        velocity: { x: 0, y: -12 },
    },
]

const TWO_MISSILES = [
    {
        position: { x: -25, y:  0  },
        velocity: { x:   0, y: -12 },
    },
    {
        position: { x: 25, y:  0  },
        velocity: { x:  0, y: -12 },
    },
]

const THREE_MISSILES = [
    {
        position: { x: 0, y:   0 },
        velocity: { x: 0, y: -12 },
    },
    {
        position: { x: -20, y:   0 },
        velocity: { x:  -3, y: -10 },
    },
    {
        position: { x: 20, y:  0  },
        velocity: { x:  3, y: -10 },
    },
]

const FOUR_MISSILES = [
    {
        position: { x: 0, y:   0 },
        velocity: { x: 0, y: -12 },
    },
    {
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 12 },
    },
    {
        position: { x: -20, y:   0 },
        velocity: { x:  -3, y: -10 },
    },
    {
        position: { x: 20, y:   0 },
        velocity: { x:  3, y: -10 },
    },
]

const FIVE_MISSILES = [
    {
        position: { x: 0, y:   0 },
        velocity: { x: 0, y: -12 },
    },
    {
        position: { x: -25, y:  0 },
        velocity: { x:   0, y: 12 },
    },
    {
        position: { x: 25, y:  0 },
        velocity: { x:  0, y: 12 },
    },
    {
        position: { x: -20, y:   0 },
        velocity: { x:  -3, y: -10 },
    },
    {
        position: { x: 20, y:   0 },
        velocity: { x:  3, y: -10 },
    },
]

export default [
    ONE_MISSILE,    // level 1
    TWO_MISSILES,   // level 2
    THREE_MISSILES, // level 3
    FOUR_MISSILES,  // level 4
    FIVE_MISSILES,  // level 5
]
