const { resources } = PIXI.loader

export default class Reward extends PIXI.Sprite {
    constructor() {
        super(resources.reward.texture)

        this.anchor.set(.5, .5)
    }

    update() {
        this.rotation += 0.15
    }
}
