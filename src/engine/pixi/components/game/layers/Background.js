import TWEEN                     from 'tween.js'
import { rotationFromDirection } from 'core/lib/orient'

const { resources } = PIXI.loader

export default class Background extends PIXI.Container {
    constructor(width, height, direction) {
        super()

        this._direction = direction

        this.displacementSprite = new PIXI.Sprite(resources.displace.texture)
        this.displacementSprite.anchor.set(.5, .5)

        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
        this.displacementFilter.scale.x = 0

        this.tiles = new PIXI.extras.TilingSprite(resources.tile.texture)
        this.tiles.position.set(-100, -100)
        this.tiles.width   = width + 200
        this.tiles.height  = height + 200
        this.tiles.filters = [this.displacementFilter]

        this.light = new PIXI.Sprite(resources.groundLight.texture)
        this.light.blendMode = PIXI.BLEND_MODES.ADD
        this.light.anchor.set(.5, .75)

        this.winkTween = new TWEEN.Tween(this.light)
            .to({ alpha: .6 }, 600)
            .repeat(Infinity)
            .yoyo(true)

        this.addChild(this.displacementSprite)
        this.addChild(this.tiles)
        this.addChild(this.light)

        this.enableEffect()
    }

    enableEffect() {
        this.displacementFilter.scale.y = 90

        this.light.opactity = 1
        this.winkTween.start()
    }

    disableEffect() {
        this.displacementFilter.scale.y = 0

        this.winkTween.stop()
        this.light.opactity = 0
    }

    set origin({ x, y }) {
        this.displacementSprite.position.set(x, y)
        this.light.position.set(x, y)
    }

    set direction(direction) {
        if (direction === this._direction) return

        this._direction = direction

        if (this.directionTween) this.directionTween.stop()

        const self = this

        const rotation        = rotationFromDirection(this._direction)
        const initialRotation = rotation === 0 ? this.light.rotation - Math.PI * 2 : this.light.rotation

        this.directionTween = new TWEEN.Tween({ rotation: initialRotation })
            .to({ rotation }, 1600)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function () {
                self.light.rotation = this.rotation
            })

        this.directionTween.start()
    }
}
