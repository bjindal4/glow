import TWEEN                     from 'tween.js'
import { rotationFromDirection } from 'core/lib/orient'

const { resources } = PIXI.loader

export default class DirectionIndicator extends PIXI.Container {
    constructor() {
        super()

        this._direction = null

        const base = new PIXI.Sprite(resources.viewDirection.texture)
        base.anchor.set(.5)
        this.addChild(base)

        this.arrow = new PIXI.Sprite(resources.viewDirectionArrow.texture)
        this.arrow.anchor.set(.5)
        this.addChild(this.arrow)
    }

    set direction(direction) {
        if (direction === this._direction) return

        this._direction = direction

        if (this.tween) this.tween.stop()

        const rotation        = rotationFromDirection(direction)
        const initialRotation = rotation === 0 ? this.arrow.rotation - Math.PI * 2 : this.arrow.rotation

        const self = this

        this.tween = new TWEEN.Tween({ rotation: initialRotation })
            .to({ rotation }, 800)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () {
                self.arrow.rotation = this.rotation
            })

        this.tween.start()
    }
}