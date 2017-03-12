import TWEEN from 'tween.js'

const { resources } = PIXI.loader

export default class Background extends PIXI.Container {
    constructor(width, height) {
        super()

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
        this.light.anchor.set(.5, .5)

        this.winkTween = new TWEEN.Tween(this.light)
            .to({ alpha: .4 }, 600)
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

    setEffectOrigin(x, y) {
        this.displacementSprite.position.set(x, y)
        this.light.position.set(x, y - 130)
    }
}
