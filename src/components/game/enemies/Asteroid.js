import _                                    from 'lodash'
import TWEEN                                from 'tween.js'
import Victor                               from 'victor'
import { Shot, SHOT_TYPE_HEXAGON }          from '../weapons'
import { spawnEnemy, spawnEnemyProjectile } from '../../../actions'
import Enemy                                from './Enemy'

const { resources } = PIXI.loader

const TAU            = Math.PI * 2
const SPAWN_INTERVAL = 20
const SPEED          = 3
const RESPAWN_COUNT  = 5

const DEFAULT_VEC = new Victor(0, SPEED)

export default class Asteroid extends Enemy {
    constructor(store, {
        vec           = DEFAULT_VEC,
        scale         = 1,
        shouldFire    = true,
        shouldRespawn = true,
        health        = 40,
        rewardsCount  = 5,
    } = {}) {
        super(store)

        this.hitRect = {
            x:      -26 * scale,
            y:      -26 * scale,
            width:  52  * scale,
            height: 52  * scale,
        }

        this.vx              = vec.x
        this.vy              = vec.y
        this.vrot            = .05

        this.health          = health
        this.isDead          = false
        this.shouldBeRemoved = false
        this.shouldFire      = shouldFire
        this.shouldRespawn   = shouldRespawn
        this.rewardsCount    = rewardsCount

        this.damage = 20
        this.points = 200

        this.shadow = new PIXI.Sprite(resources.asteroidShadow.texture)
        this.shadow.y       = 30
        this.shadow.scale.x = scale
        this.shadow.scale.y = scale
        this.shadow.pivot.set(32, 32)
        this.addChild(this.shadow)

        this.graphic = new PIXI.Sprite(resources.asteroid.texture)
        this.graphic.scale.x = scale
        this.graphic.scale.y = scale
        this.graphic.pivot.set(32, 32)
        this.addChild(this.graphic)
    }

    respawn() {
        if (!this.shouldRespawn) return

        const angle = TAU / RESPAWN_COUNT

        _.range(RESPAWN_COUNT).forEach(i => {
            const vec = DEFAULT_VEC.clone().rotate(i * angle)

            const spawned = new Asteroid(this.store, {
                vec,
                scale:         .7,
                shouldFire:    false,
                shouldRespawn: false,
                health:        1,
                rewardsCount:  1,
            })

            spawned.x = this.x
            spawned.y = this.y

            this.store.dispatch(spawnEnemy(spawned))
        })
    }

    die() {
        super.die()

        this.vy   = 0
        this.vrot = 0

        this.spawnPoints('#f6a160')
        this.spawnRewards(this.rewardsCount)

        const self  = this

        this.respawn()

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
                self.graphic.scale.x = this.scale
                self.graphic.scale.y = this.scale
                self.graphic.alpha   = this.alpha
                self.shadow.scale.x  = this.scale
                self.shadow.scale.y  = this.scale
                self.shadow.alpha    = this.alpha
            })
            .onComplete(() => {
                this.shouldBeRemoved = true
            })

        tween.start()
    }

    fire() {
        if (!this.shouldFire) return

        const vec  = new Victor(0, 2).rotate(this.graphic.rotation)
        const shot = new Shot(SHOT_TYPE_HEXAGON, vec)

        shot.x = this.x
        shot.y = this.y

        this.store.dispatch(spawnEnemyProjectile(shot))
    }

    tick(time) {
        this.x                += this.vx
        this.y                += this.vy
        this.graphic.rotation += this.vrot
        this.shadow.rotation   = this.graphic.rotation

        if (!this.isDead && time % SPAWN_INTERVAL === 0) {
            this.fire()
        }
    }
}