const { resources } = PIXI.loader

export default class Missile extends PIXI.Sprite {
    constructor({ id }) {
        super(resources.missile.texture)

        this.id = id

        this.anchor.set(.5, .5)

        this.isDead          = false
        this.shouldBeRemoved = false

        this.ammoType = 'missile'
        this.damage   = 20
    }

    die() {
        this.isDead          = true
        this.shouldBeRemoved = true

        this.vx = 0
        this.vy = 0
    }
}