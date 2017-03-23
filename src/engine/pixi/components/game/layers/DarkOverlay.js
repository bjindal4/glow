import TWEEN from 'tween.js'

const { resources } = PIXI.loader

export default class DarkOverlay extends PIXI.Sprite {
    constructor() {
        super(resources.darken.texture)

        this._nightShift = false

        this.anchor.set(.5, .5)
        this.blendMode = PIXI.BLEND_MODES.MULTIPLY
        this.alpha     = .3
    }

    set nightShift(isEnabled) {
        if (this._nightShift === isEnabled) return

        this._nightShift = isEnabled

        if (this.shiftTween) this.shiftTween.stop()

        this.shiftTween = new TWEEN.Tween(this)
            .easing(TWEEN.Easing.Exponential.Out)
            .to({ alpha: isEnabled ? 1 : .3 }, 1000)

        this.shiftTween.start()
    }
}