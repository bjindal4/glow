import {
    SHOT_TYPE_BASIC,
    SHOT_TYPE_SQUARE,
    SHOT_TYPE_HEXAGON,
} from '../../../../../config'

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
    constructor({ id, type: typeId }) {
        const type = types[typeId]

        super(resources[type.image].texture)

        this.id = id

        this.anchor.set(.5, .5)

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
}