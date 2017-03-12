import Victor          from 'victor'
import { Attractable } from '../../../behaviours'

const { resources } = PIXI.loader

const MISSILE_SPEED = 6

export default class Missile extends PIXI.Sprite {
    constructor() {
        super(resources.missile.texture)

        this.pivot.set(2, 8)

        this.vx = 0
        this.vy = -MISSILE_SPEED

        this.isDead          = false
        this.shouldBeRemoved = false

        this.ammoType = 'missile'
        this.damage   = 20

        this.attraction = new Attractable(this, {
            maxDistance:    360,
            resultingSpeed: MISSILE_SPEED,
        })
    }

    computeAttraction(entities) {
        this.attraction.compute(entities)
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

        const vec = new Victor(this.vx, this.vy)
        this.rotation = vec.horizontalAngle() + Math.PI * .5
    }
}