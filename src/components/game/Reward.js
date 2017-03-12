import { Attractable } from '../../behaviours'

const { resources } = PIXI.loader

export default class Reward extends PIXI.Sprite {
    constructor() {
        super(resources.reward.texture)

        this.anchor.set(.5, .5)

        this.vx = 0
        this.vy = 2

        this.shouldBeRemoved = false

        this.attraction = new Attractable(this, {
            maxDistance:    300,
            resultingSpeed: 12,
        })
    }

    computeAttraction(ship) {
        this.attraction.compute([ship])
    }

    tick() {
        this.x += this.vx
        this.y += this.vy

        this.rotation += 0.15
    }
}
