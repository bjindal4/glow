import TWEEN    from 'tween.js'
import Victor   from 'victor'
import Keyboard from 'keyboardjs'
import Menu     from '../../core/Menu'
import {
    setCurrentScene,
    continueGame,
} from 'core/actions'

const { resources } = PIXI.loader

const TAU = Math.PI * 2

const choices = [
    {
        normal: 'continueButton',
        focus:  'continueButtonFocus',
        value:  'continue',
    },
    {
        normal: 'quitButton',
        focus:  'quitButtonFocus',
        value:  'quit',
    },
]

export default class GameOver extends PIXI.Container {
    constructor(store) {
        super()

        this.store = store

        const { screen: { width, height } } = store.getState()

        this.skullHead = new PIXI.Sprite(resources.skullHead.texture)
        this.skullHead.anchor.set(.5, .5)
        this.skullHead.position.set(width * .5, height * .5)
        this.addChild(this.skullHead)

        const self = this

        this.skullHeadTween = new TWEEN.Tween({ rotation: 0 })
            .to({ rotation: TAU }, 8000)
            .repeat(Infinity)
            .onUpdate(function () {
                const vec = new Victor(0, 240)
                vec.rotate(this.rotation)
                self.skullHead.position.set(vec.x + width * .5, vec.y + height * .5)
            })

        this.menu = new Menu({
            choices,
            itemHeight:   90,
            context:      'gameOverMenu',
            initialValue: 'continue',
            onChange:     value => {
                this.menu.setValue(value)
            },
            onConfirm:    value => {
                if (value === 'quit') {
                    this.store.dispatch(setCurrentScene('home'))
                } else if (value === 'continue') {
                    this.store.dispatch(continueGame())
                }
            },
        })
        this.menu.position.set(width * .5 - 160, height * .5 - 90)
        this.addChild(this.menu)

        this.isGameOver = false
        this.visible    = false
        this.alpha      = 0

        this.enterTween = new TWEEN.Tween(this)
        this.leaveTween = new TWEEN.Tween(this)
            .onComplete(() => {
                this.visible = false
            })
    }

    willEnter() {
        Keyboard.setContext('gameOverMenu')
        this.visible = true
        this.enterTween.to({ alpha: 1 }, 400)
        this.enterTween.start()
        this.skullHeadTween.start()
    }

    willLeave() {
        this.skullHeadTween.stop()
        this.leaveTween.to({ alpha: 0 }, 400)
        this.leaveTween.start()
        Keyboard.setContext('game')
    }

    setIsGameOver(isGameOver) {
        if (this.isGameOver === isGameOver) return

        this.isGameOver = isGameOver

        if (this.isGameOver) {
            this.willEnter()
        } else {
            this.willLeave()
        }
    }
}