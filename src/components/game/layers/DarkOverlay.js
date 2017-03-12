const { resources } = PIXI.loader

export default class DarkOverlay extends PIXI.Sprite {
    constructor() {
        super(resources.darken.texture)

        this.anchor.set(.5, .5)
        this.blendMode = PIXI.BLEND_MODES.MULTIPLY
        this.alpha     = .5
    }
}