export const SHOT_TYPE_BASIC   = 'SHOT_TYPE_BASIC'
export const SHOT_TYPE_SQUARE  = 'SHOT_TYPE_SQUARE'
export const SHOT_TYPE_HEXAGON = 'SHOT_TYPE_HEXAGON'

const SPEED_LOW    = 12
const SPEED_MEDIUM = 9
const SPEED_HIGH   = 6

const ONE_SHOT     = [
    {
        position: { x: 0, y:  0 },
        velocity: { x: 0, y: -8 },
    },
]
const TWO_SHOTS    = [
    {
        position: { x: -25, y:  0 },
        velocity: { x:   0, y: -8 },
    },
    {
        position: { x: 25, y:  0 },
        velocity: { x:  0, y: -8 },
    },
]
const THREE_SHOTS  = [
    {
        position: { x: 0, y:  0 },
        velocity: { x: 0, y: -8 },
    },
    {
        position: { x: -20, y:  0 },
        velocity: { x:  -3, y: -8 },
    },
    {
        position: { x: 20, y:  0 },
        velocity: { x:  3, y: -8 },
    },
]
const FOUR_SHOTS   = [
    {
        position: { x: 0, y:  0 },
        velocity: { x: 0, y: -8 },
    },
    {
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 8 },
    },
    {
        position: { x: -20, y:  0 },
        velocity: { x:  -3, y: -8 },
    },
    {
        position: { x: 20, y:  0 },
        velocity: { x:  3, y: -8 },
    },
]
const FIVE_SHOTS   = [
    {
        position: { x: 0, y:  0 },
        velocity: { x: 0, y: -8 },
    },
    {
        position: { x: -25, y: 0 },
        velocity: { x:   0, y: 8 },
    },
    {
        position: { x: 25, y: 0 },
        velocity: { x:  0, y: 8 },
    },
    {
        position: { x: -20, y:  0 },
        velocity: { x:  -3, y: -8 },
    },
    {
        position: { x: 20, y:  0 },
        velocity: { x:  3, y: -8 },
    },
]
const SEVEN_SHOTS  = [
    {
        position: { x: 0, y:  0 },
        velocity: { x: 0, y: -8 },
    },
    {
        position: { x: -25, y: 0 },
        velocity: { x:   0, y: 8 },
    },
    {
        position: { x: 25, y: 0 },
        velocity: { x:  0, y: 8 },
    },
    {
        position: { x: -20, y: 0 },
        velocity: { x:  -8, y: 0 },
    },
    {
        position: { x: 20, y: 0 },
        velocity: { x:  8, y: 0 },
    },
    {
        position: { x: -20, y:  0 },
        velocity: { x:  -3, y: -8 },
    },
    {
        position: { x: 20, y:  0 },
        velocity: { x:  3, y: -8 },
    },
]

export default [
    { speed: SPEED_LOW,    config: ONE_SHOT    }, // level 1
    { speed: SPEED_LOW,    config: TWO_SHOTS   }, // level 2
    { speed: SPEED_LOW,    config: THREE_SHOTS }, // level 3
    { speed: SPEED_MEDIUM, config: THREE_SHOTS }, // level 4
    { speed: SPEED_MEDIUM, config: FOUR_SHOTS  }, // level 5
    { speed: SPEED_HIGH,   config: FOUR_SHOTS  }, // level 6
    { speed: SPEED_HIGH,   config: FIVE_SHOTS  }, // level 7
    { speed: SPEED_HIGH,   config: SEVEN_SHOTS }, // level 8
]