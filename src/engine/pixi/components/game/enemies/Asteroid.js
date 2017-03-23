import _                                    from 'lodash'
import TWEEN                                from 'tween.js'
import Victor                               from 'victor'
import { spawnEnemy, spawnEnemyProjectile } from 'core/actions'
import EntityPool                           from 'core/lib/EntityPool'
import Enemy                                from './Enemy'

const { resources } = PIXI.loader

const TAU            = Math.PI * 2
const SPEED          = 3
const RESPAWN_COUNT  = 5

const DEFAULT_VEC = new Victor(0, SPEED)

export default class Asteroid extends Enemy {
    static get TYPE() {
        return 'asteroid'
    }

    static getPool(container) {
        return new EntityPool({
            create: a => {
                const asteroid = new Asteroid(a)
                asteroid.position.set(a.x, a.y)
                asteroid.health = a.health
                asteroid.age    = a.age
                container.addChild(asteroid)

                return asteroid
            },
            update: (asteroid, next) => {
                asteroid.position.set(next.x, next.y)
                asteroid.health = next.health
                asteroid.age    = next.age
                asteroid.update()
            },
            remove: stale => {
                stale.visible = false
            },
            recycle: (old, asteroid) => {
                old.id     = asteroid.id
                old.health = asteroid.health
                old.age    = asteroid.age
                old.position.set(asteroid.x, asteroid.y)
                old.reset()
                old.visible = true
            },
        })
    }

    constructor(store, {
        scale         = 1,
        shouldRespawn = true,
        rewardsCount  = 5,
    } = {}) {
        super(store)

        this.shouldRespawn   = shouldRespawn
        this.rewardsCount    = rewardsCount

        this.shadow = new PIXI.Sprite(resources.asteroidShadow.texture)
        this.shadow.y       = 30
        this.shadow.scale.x = scale
        this.shadow.scale.y = scale
        this.shadow.anchor.set(.5, .5)
        this.addChild(this.shadow)

        this.graphic = new PIXI.Sprite(resources.asteroid.texture)
        this.graphic.scale.x = scale
        this.graphic.scale.y = scale
        this.graphic.anchor.set(.5, .5)
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
                self.graphic.scale.x = this.scale
                self.graphic.scale.y = this.scale
                self.graphic.alpha   = this.alpha
                self.shadow.scale.x  = this.scale
                self.shadow.scale.y  = this.scale
                self.shadow.alpha    = this.alpha
            })
            .onComplete(() => {
                // @todo
            })

        tween.start()
    }

    update() {
        if (this._health <= 0) return // dead

        this.graphic.rotation = this.age * .05
        this.shadow.rotation  = this.graphic.rotation
    }
}