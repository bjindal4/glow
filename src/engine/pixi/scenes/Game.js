import Keyboard     from 'keyboardjs'
import * as actions from 'core/actions'
import Ship         from '../components/game/Ship'
import {
    Hud,
    Background,
    DarkOverlay,
    PauseMenu,
    Popups,
    Bonuses,
    GameOver,
    Weapons,
    Enemies,
    EnemiesWeapons,
    Rewards,
} from '../components/game/layers'

const { resources } = PIXI.loader

export default class Game extends PIXI.Container {
    constructor(store) {
        super()

        this.id = 'game'

        this.visible = false

        this.store  = store
        const state = store.getState()

        const {
            screen: { width, height },
            game:   { direction },
        } = state

        this.background = new Background(width, height, direction)
        this.addChild(this.background)

        this.rewards = new Rewards()
        this.addChild(this.rewards)

        this.enemiesWeapons = new EnemiesWeapons()
        this.addChild(this.enemiesWeapons)

        this.enemies = new Enemies()
        this.addChild(this.enemies)

        this.weapons = new Weapons()
        this.addChild(this.weapons)

        this.bonuses = new Bonuses(id => {
            this.store.dispatch(actions.removeBonus(id))
        })
        this.addChild(this.bonuses)

        this.shipInitPosition = {
            x: width  * .5,
            y: height * .8,
        }

        this.ship = new Ship(store)
        this.ship.position.set(this.shipInitPosition.x, this.shipInitPosition.y)
        this.addChild(this.ship)

        this.darkOverlay = new DarkOverlay()
        this.darkOverlay.x = this.ship.x
        this.darkOverlay.y = this.ship.y
        this.addChild(this.darkOverlay)

        this.popups = new Popups(store)
        this.addChild(this.popups)

        this.gameOver = new GameOver(this.store)
        this.addChild(this.gameOver)

        this.hud = new Hud(width, height)
        this.addChild(this.hud)

        this.goodLuck = new PIXI.Sprite(resources.goodLuck.texture)
        this.goodLuck.anchor.set(.5, .5)
        this.goodLuck.position.set(width * .5, height * .5)
        //this.addChild(this.goodLuck)

        this.isPaused  = state.game.isPaused
        this.pauseMenu = new PauseMenu(width, height, value => {
            if (value === 'resume') {
                this.store.dispatch(actions.resume())
            } else if (value === 'quit') {
                store.dispatch(actions.setCurrentScene('home'))
            }
        })
        this.addChild(this.pauseMenu)

        this.setupInteractivity()
    }

    willEnter() {
        this.store.dispatch(actions.startGame())
        Keyboard.setContext('game')
        this.visible = true
        this.ship.launch()
    }

    willLeave() {
        this.visible = false

        this.store.dispatch(actions.stopGame())
    }

    setupInteractivity() {
        Keyboard.withContext('game', () => {
            const dirs = ['up', 'right', 'down', 'left']
            dirs.forEach(direction => {
                Keyboard.bind(direction, e => {
                    e.preventRepeat()
                    this.store.dispatch(actions.enableMoveControl(direction))
                }, () => {
                    this.store.dispatch(actions.disableMoveControl(direction))
                })
            })

            Keyboard.bind('space', () => {
                const { weapons: { isFiring } } = this.store.getState()
                if (!isFiring) this.store.dispatch(actions.enableFiring())
            }, () => {
                this.store.dispatch(actions.disableFiring())
            })

            Keyboard.bind('f', () => {}, () => {
                const { weapons: { isFiring } } = this.store.getState()
                if (!isFiring) return this.store.dispatch(actions.enableFiring())
                this.store.dispatch(actions.disableFiring())
            })

            Keyboard.bind('p', () => {}, () => {
                this.store.dispatch(actions.pause())
            })

            Keyboard.bind('x', () => {}, () => {
                this.store.dispatch(actions.switchGameDirection())
            })

            Keyboard.bind('n', () => {}, () => {
                const { game: { nightShift: { isEnabled } } } = this.store.getState()
                if (isEnabled) return this.store.dispatch(actions.disableNightShift())
                this.store.dispatch(actions.enableNightShift())
            })
        })
    }

    tick() {
        if (!this.visible) return

        this.store.dispatch(actions.gameTick())

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
            direction:         state.game.direction,
            health:            state.player.health,
            score:             state.player.score,
            lives:             state.player.lives,
            shotsLevel:        state.weapons.shots.level,
            missilesLevel:     state.weapons.missiles.level,
            nightShiftEnabled: state.game.nightShift.isEnabled,
        })

        this.gameOver.setIsGameOver(state.game.isGameOver)

        if (!state.game.isPaused) {
            const {
                ship: { x: shipX, y: shipY },
                game: { direction, nightShift },
            } = state

            this.weapons.update(state.weapons)
            this.bonuses.update(state.bonuses.items)
            this.enemies.update(state.enemies.items)
            this.enemiesWeapons.update(state.enemies.projectiles)
            this.popups.update(state.game.popups)
            this.rewards.update(state.game.rewards)

            this.ship.direction = direction
            this.ship.tick()

            this.background.origin    = { x: shipX, y: shipY }
            this.background.direction = direction

            this.darkOverlay.position.set(this.ship.x, this.ship.y)
            this.darkOverlay.nightShift = nightShift.isEnabled
        }
    }
}
