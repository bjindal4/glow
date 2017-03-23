import TWEEN  from 'tween.js'
import config from '../../../../config'

const { resources } = PIXI.loader

export default class Bonus extends PIXI.Container {
    constructor({ id, type }, remove) {
        super()

        this.icon = new PIXI.Sprite()

        this.id        = id
        this.type      = type
        this._pickedUp = false
        this.remove    = remove

        this.icon.anchor.set(.5, .5)
        this.addChild(this.icon)

        this.reset()
    }

    set type(type) {
        this._type        = config.bonuses[type]
        this.icon.texture = resources[this._type.img].texture
    }

    set pickedUp(flag) {
        if (flag === this._pickedUp) return

        this._pickedUp = flag
        if (this._pickedUp === true) {
            this.deadTween.start()
        }
    }

    reset() {
        this._pickedUp = false

        this.icon.alpha = 1
        this.icon.scale.set(1)

        if (this.deadTween) this.deadTween.stop()

        const self = this
        this.deadTween = new TWEEN.Tween({ scale: 1, alpha: 1 })
            .to({ scale: 1.8, alpha: 0 }, 400)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () {
                self.icon.scale.x = this.scale
                self.icon.scale.y = this.scale
                self.icon.alpha   = this.alpha
            })
            .onComplete(() => {
                this.remove(this.id)
            })

        this.visible = true
    }

    destroy() {
        this.deadTween.stop()
        delete this.deadTween

        super.destroy()
    }
}
