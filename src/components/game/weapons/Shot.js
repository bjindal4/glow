export const SHOT_TYPE_BASIC   = 'SHOT_TYPE_BASIC'
export const SHOT_TYPE_SQUARE  = 'SHOT_TYPE_SQUARE'
export const SHOT_TYPE_HEXAGON = 'SHOT_TYPE_HEXAGON'

const types = {
    [SHOT_TYPE_BASIC]: {
        image:  'shot',
        damage: 10,
    },
    [SHOT_TYPE_SQUARE]: {
        image:  'shotSquare',
        damage: 10,
    },
    [SHOT_TYPE_HEXAGON]: {
        image:  'shotHexagon',
        damage: 30,
    }
}

const { resources } = PIXI.loader

export class Shot extends PIXI.Sprite {
    constructor(typeId, vector) {
        const type = types[typeId]

        super(resources[type.image].texture)

        this.anchor.set(.5, .5)

        this.vx = vector.x
        this.vy = vector.y

        this.isDead          = false
        this.shouldBeRemoved = false

        this.ammoType = 'shot'
        this.damage   = type.damage
    }

    die() {
        this.isDead          = true
        this.shouldBeRemoved = true

        this.vx = 0
        this.vy = 0
    }

    tick() {
        this.x += this.vx
        this.y += this.vy
    }
}