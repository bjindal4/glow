import TWEEN from 'tween.js'

const { resources } = PIXI.loader

export default class MenuCursor extends PIXI.Container {
    constructor() {
        super()

        this.scale.x = .6
        this.scale.y = .6

        this.shadow = new PIXI.Sprite(resources.shipShadow.texture)
        this.shadow.anchor.set(.5, .5)
        this.shadow.rotation = Math.PI * .5
        this.shadow.y = 20
        this.addChild(this.shadow)

        this.ship = new PIXI.Sprite(resources.ship.texture)
        this.ship.anchor.set(.5, .5)
        this.ship.rotation = Math.PI * .5
        this.addChild(this.ship)

        this.trail = new PIXI.Sprite(resources.shipTrail.texture)
        this.trail.anchor.set(0, .5)
        this.trail.rotation = Math.PI
        this.trail.x = -29
        this.addChild(this.trail)

        const self = this

        const tween = new TWEEN.Tween({ offset: -4, scale: 1.2 })
            .to({ offset: 4, scale: .8 }, 800)
            .repeat(Infinity)
            .yoyo(true)
            .onUpdate(function () {
                self.ship.y        = this.offset
                self.trail.y       = this.offset
                self.trail.scale.x = this.scale
            })

        tween.start()
    }
}
