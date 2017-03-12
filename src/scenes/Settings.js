import Keyboard            from 'keyboardjs'
import TWEEN               from 'tween.js'
import { setCurrentScene } from '../actions'
import Menu                from '../components/core/Menu'

const { resources } = PIXI.loader

const choices = [
    {
        normal: 'quitButton',
        focus:  'quitButtonFocus',
        value:  'quit',
    },
]

export const SETTINGS_CONTEXT = 'settings'

export default class Settings extends PIXI.Container {
    constructor(store) {
        super()

        const { screen: { width, height } } = store.getState()

        this.id = SETTINGS_CONTEXT

        const bg = new PIXI.Graphics()
        bg.beginFill(0x210f1d)
        bg.drawRect(0, 0, width, height)
        bg.endFill()
        this.addChild(bg)

        this.logo = new PIXI.Sprite(resources.logo.texture)
        this.logo.anchor.set(.5, .5)
        this.logo.position.set(width * .5, 60)
        this.addChild(this.logo)

        this.menu = new Menu({
            choices,
            itemHeight:   90,
            context:      SETTINGS_CONTEXT,
            initialValue: 'quit',
            onChange:     () => {},
            onConfirm:    () => {
                store.dispatch(setCurrentScene('home'))
            },
        })
        this.menu.position.set(width * .5 - 160, height * .95 - 90)
        this.addChild(this.menu)

        this.alpha   = 0
        this.visible = false

        this.enterTween = new TWEEN.Tween(this)
        this.leaveTween = new TWEEN.Tween(this)
            .onComplete(() => {
                this.visible = false
            })
    }

    willEnter() {
        Keyboard.setContext(SETTINGS_CONTEXT)
        this.visible = true
        this.leaveTween.stop()
        this.enterTween.to({ alpha: 1 }, 400)
        this.enterTween.start()
    }

    willLeave() {
        this.enterTween.stop()
        this.leaveTween.to({ alpha: 0 }, 400)
        this.leaveTween.start()
    }

    tick() {
        if (!this.visible) return
    }
}
