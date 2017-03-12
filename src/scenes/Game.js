import Keyboard                                            from 'keyboardjs'
import { hitTestRectangle, contain }                       from '../lib/collision'
import Emitter                                             from '../lib/Emitter'
import Ship                                                from '../components/game/Ship'
import { Asteroid, Saucer }                                from '../components/game/enemies'
import {
    ShotEmitter,
    Shot,
    SHOT_TYPE_BASIC,
    Missile,
    MissilesEmitter,
} from '../components/game/weapons'
import {
    Hud,
    Background,
    DarkOverlay,
    PauseMenu,
    Popups,
    Bonuses,
} from '../components/game/layers'
import {
    enableFiring, disableFiring,
    spawnProjectile, removeProjectile,
    pause, resume,
    spawnEnemy, removeEnemy, enemyHit,
    removeEnemyProjectile,
    registerLayer,
    shipHit,
    setCurrentScene,
    removeReward,
    stopGame,
} from '../actions'

const { resources } = PIXI.loader

export default class Game extends PIXI.Container {
    constructor(store) {
        super()

        this.id = 'game'

        this.visible = false

        this.store  = store
        const state = store.getState()

        const { screen: { width, height } } = state

        this.boundaries = {
            scene:    { x: 0, y: 0, width, height },
            entities: {
                x:      -60,
                y:      -60,
                width:  width + 120,
                height: height + 120,
            },
        }

        this.background = new Background(width, height)
        this.addChild(this.background)

        this.rewards = new PIXI.particles.ParticleContainer(5000, {
            position: true,
            rotation: true,
        })
        this.addChild(this.rewards)
        this.store.dispatch(registerLayer('game.rewards', this.rewards))

        this.main = new PIXI.Container()
        this.addChild(this.main)
        this.store.dispatch(registerLayer('game.main', this.main))

        this.bonuses = new Bonuses(this.store)
        this.addChild(this.bonuses)
        this.store.dispatch(registerLayer('game.bonuses', this.bonuses))

        this.shipInitPosition = {
            x: width  * .5,
            y: height * .8,
        }

        this.ship = new Ship()
        this.ship.position.set(this.shipInitPosition.x, this.shipInitPosition.y)
        this.addChild(this.ship)

        this.darkOverlay = new DarkOverlay()
        this.darkOverlay.x = this.ship.x
        this.darkOverlay.y = this.ship.y
        this.addChild(this.darkOverlay)

        this.popups = new Popups(store)
        this.addChild(this.popups)
        this.store.dispatch(registerLayer('game.popups', this.popups))

        this.hud = new Hud(width, height)
        this.addChild(this.hud)

        this.goodLuck = new PIXI.Sprite(resources.goodLuck.texture)
        this.goodLuck.anchor.set(.5, .5)
        this.goodLuck.position.set(width * .5, height * .5)
        //this.addChild(this.goodLuck)

        this.isPaused  = state.game.isPaused
        this.pauseMenu = new PauseMenu(width, height, value => {
            if (value === 'resume') {
                this.store.dispatch(resume())
            } else if (value === 'quit') {
                store.dispatch(setCurrentScene('home'))
            }
        })
        this.addChild(this.pauseMenu)

        this.setupEmitters()
        this.setupInteractivity()
    }

    willEnter() {
        Keyboard.setContext('game')
        this.visible = true
        this.ship.launch()
    }

    willLeave() {
        this.visible = false

        this.store.dispatch(stopGame())
    }

    setupInteractivity() {
        Keyboard.withContext('game', () => {
            Keyboard.bind('space', () => {
                const { weapons: { isFiring } } = this.store.getState()
                if (!isFiring) this.store.dispatch(enableFiring())
            }, () => {
                this.store.dispatch(disableFiring())
            })

            Keyboard.bind('p', () => {}, () => {
                this.store.dispatch(pause())
            })
        })
    }

    setupEmitters() {
        const shotEmitter = new ShotEmitter(shotsConfigs => {
            shotsConfigs.forEach(({ position, vector }) => {
                const shot = new Shot(SHOT_TYPE_BASIC, vector)

                shot.x = this.ship.x + position.x
                shot.y = this.ship.y + position.y

                this.store.dispatch(spawnProjectile(shot))
            })
        })

        const asteroidEmitter = new Emitter(60, () => {
            const asteroid = new Asteroid(this.store)

            const { screen: { width } } = this.store.getState()

            asteroid.x = Math.random() * width
            asteroid.y = -40

            this.store.dispatch(spawnEnemy(asteroid))
        })

        const saucerEmitter = new Emitter(30, () => {
            const saucer = new Saucer(this.store)

            const { screen: { width } } = this.store.getState()

            saucer.x = Math.random() * width
            saucer.y = -40

            saucer.vy = 2 + Math.random() * 3

            this.store.dispatch(spawnEnemy(saucer))
        })

        const missilesEmitter = new MissilesEmitter(missilesConfigs => {
            missilesConfigs.forEach(({ position, vector }) => {
                const missile = new Missile(vector)

                missile.x = this.ship.x + position.x
                missile.y = this.ship.y + position.y

                this.store.dispatch(spawnProjectile(missile))
            })
        })

        this.emitters = {
            shot:     shotEmitter,
            asteroid: asteroidEmitter,
            saucer:   saucerEmitter,
            missiles: missilesEmitter,
        }
    }

    shipHit(damage) {
        const isDead = this.store.dispatch(shipHit(damage))
        if (isDead) {
            this.ship.position.set(this.shipInitPosition.x, this.shipInitPosition.y)
            this.ship.launch()
        }
    }

    tick(time) {
        if (!this.visible) return

        const state = this.store.getState()

        const { isPaused } = state.game
        if (isPaused !== this.isPaused) {
            if (isPaused) {
                this.pauseMenu.willEnter()
            } else {
                this.pauseMenu.willLeave()
                Keyboard.setContext('game')
            }
            this.isPaused = isPaused
        }

        this.hud.update({
            health:        state.player.health,
            score:         state.player.score,
            lives:         state.player.lives,
            shotLevel:     state.weapons.shot.level,
            missilesLevel: state.weapons.missiles.level,
        })

        if (!state.game.isPaused) {
            this.bonuses.tick(time, this.ship)

            let aliveEnemies = state.enemies.items.filter(e => !e.isDead)

            state.weapons.projectiles.forEach(projectile => {
                if (!projectile.shouldBeRemoved && contain(projectile, this.boundaries.entities).length > 0) {
                    projectile.shouldBeRemoved = true
                }

                if (!projectile.shouldBeRemoved && !projectile.isDead) {
                    aliveEnemies.some(enemy => {
                        if (enemy.isDead) return

                        if (hitTestRectangle(projectile, enemy)) {
                            this.store.dispatch(enemyHit(enemy, projectile))
                            return true
                        }
                    })
                }

                if (projectile.shouldBeRemoved) {
                    return this.store.dispatch(removeProjectile(projectile))
                }

                if (projectile.ammoType === 'missile') projectile.computeAttraction(aliveEnemies)
                projectile.tick()
            })

            state.enemies.items.forEach(enemy => {
                if (!enemy.isDead) {
                    if (contain(enemy, this.boundaries.entities).length > 0) {
                        enemy.shouldBeRemoved = true
                    } else if (this.ship.isActive && hitTestRectangle(this.ship, enemy)) {
                        enemy.die()
                        this.ship.collision()
                        this.shipHit(enemy.damage)
                    }
                }

                if (enemy.shouldBeRemoved) {
                    return this.store.dispatch(removeEnemy(enemy))
                }

                enemy.tick(time)
            })

            state.enemies.projectiles.forEach(projectile => {
                if (!projectile.shouldBeRemoved && contain(projectile, this.boundaries.entities).length > 0) {
                    projectile.shouldBeRemoved = true
                    projectile.die()
                }

                if (
                    this.ship.isActive          &&
                    !projectile.shouldBeRemoved &&
                    !projectile.isDead          &&
                    hitTestRectangle(projectile, this.ship)
                ) {
                    this.ship.hit()
                    this.shipHit(projectile.damage)
                    projectile.die()
                }

                if (projectile.shouldBeRemoved) {
                    return this.store.dispatch(removeEnemyProjectile(projectile))
                }

                projectile.tick()
            })

            state.game.rewards.forEach(reward => {
                if (contain(reward, this.boundaries.entities).length > 0) {
                    return this.store.dispatch(removeReward(reward))
                }

                if (this.ship.isActive && hitTestRectangle(this.ship, reward)) {
                    return this.store.dispatch(removeReward(reward))
                }

                if (this.ship.isActive) reward.computeAttraction(this.ship)
                reward.tick()
            })

            this.emitters.asteroid.tick(time)
            this.emitters.saucer.tick(time)

            if (this.ship.isActive && state.weapons.isFiring) {
                const { weapons } = state
                this.emitters.missiles.level = weapons.missiles.level
                this.emitters.missiles.tick(time)
                this.emitters.shot.level     = weapons.shot.level
                this.emitters.shot.tick(time)
            }

            this.ship.tick()
            this.background.setEffectOrigin(this.ship.x, this.ship.y)
            this.darkOverlay.position.set(this.ship.x, this.ship.y)
            contain(this.ship, this.boundaries.scene)
        }
    }
}
