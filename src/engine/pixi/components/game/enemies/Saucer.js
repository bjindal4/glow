import TWEEN      from 'tween.js'
import EntityPool from 'core/lib/EntityPool'
import Enemy      from './Enemy'

const { resources } = PIXI.loader

export default class Saucer extends Enemy {
    static get TYPE() {
        return 'saucer'
    }

    static getPool(container) {
        return new EntityPool({
            create: s => {
                const saucer = new Saucer(s)
                saucer.position.set(s.x, s.y)
                container.addChild(saucer)

                return saucer
            },
            update: (saucer, next) => {
                saucer.position.set(next.x, next.y)
                saucer.health = next.health
                saucer.update()
            },
            remove: stale => {
                stale.visible = false
            },
            recycle: (old, saucer) => {
                old.id     = saucer.id
                old.health = saucer.health
                old.position.set(saucer.x, saucer.y)
                old.reset()
                old.visible = true
            },
        })
    }

    constructor(store) {
        super(store)

        this.shadow = new PIXI.Sprite(resources.saucerShadow.texture)
        this.shadow.y = 14
        this.shadow.anchor.set(.5, .5)
        this.addChild(this.shadow)

        this.graphic = new PIXI.Sprite(resources.saucer.texture)
        this.graphic.anchor.set(.5, .5)
        this.addChild(this.graphic)
    }

    reset() {
        this.graphic.scale.set(1)
        this.graphic.alpha = 1
        this.shadow.scale.set(1)
        this.shadow.alpha = 1
    }

    die() {
        const self = this

        const tween = new TWEEN.Tween({
            scale: 1,
            alpha: 1,
        })
            .to({
                scale: .1,
                alpha: 0,
            }, 600)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function () {
                self.graphic.scale.x         = this.scale
                self.graphic.scale.y         = this.scale
                self.graphic.alpha           = this.alpha
                self.shadow.scale.x          = this.scale
                self.shadow.scale.y          = this.scale
                self.shadow.alpha            = this.alpha
            })
            .onComplete(() => {
                // @todo
            })

        tween.start()
    }

    update() {}
}