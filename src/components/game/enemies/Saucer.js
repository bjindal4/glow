import TWEEN                      from 'tween.js'
import { Shot, SHOT_TYPE_SQUARE } from '../weapons'
import { spawnEnemyProjectile }   from '../../../actions'
import Enemy                      from './Enemy'

const { resources } = PIXI.loader

const SPAWN_INTERVAL = 30

export default class Saucer extends Enemy {
    constructor(store) {
        super(store)

        this.hitRect = {
            x:      -20,
            y:      -20,
            width:   40,
            height:  40,
        }

        this.vy           = 3
        this.vrot         = .05

        this.health       = 1
        this.damage       = 10
        this.points       = 100
        this.rewardsCount = 3

        this.shadow = new PIXI.Sprite(resources.saucerShadow.texture)
        this.shadow.y = 14
        this.shadow.anchor.set(.5, .5)
        this.addChild(this.shadow)

        this.graphic = new PIXI.Sprite(resources.saucer.texture)
        this.graphic.anchor.set(.5, .5)
        this.addChild(this.graphic)
    }

    die() {
        super.die()

        this.spawnPoints('#35eff5')
        this.spawnRewards(this.rewardsCount)

        this.vy = 0

        const self  = this

        const tween = new TWEEN.Tween({
            scale: 1,
            alpha: 1,
        })
            .to({
                scale: .1,
                alpha: 0,
            }, 400)
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
                self.shouldBeRemoved = true
            })

        tween.start()
    }

    fire() {
        const shot = new Shot(SHOT_TYPE_SQUARE, { x: 0, y: this.vy * 1.5 })

        shot.x = this.x
        shot.y = this.y

        this.store.dispatch(spawnEnemyProjectile(shot))
    }

    tick(time) {
        this.y += this.vy

        if (!this.isDead && time % SPAWN_INTERVAL === 0) {
            this.fire()
        }
    }
}