import Keyboard            from 'keyboardjs'
import TWEEN               from 'tween.js'
import { setCurrentScene } from 'core/actions'
import Menu                from '../components/core/Menu'

const { resources } = PIXI.loader

const choices = [
    {
        normal: 'quitButton',
        focus:  'quitButtonFocus',
        value:  'quit',
    },
]

export const HELP_CONTEXT = 'help'

export default class Help extends PIXI.Container {
    constructor(store) {
        super()

        const { screen: { width, height } } = store.getState()

        this.id = HELP_CONTEXT

        const bg = new PIXI.Graphics()
        bg.beginFill(0x210f1d)
        bg.drawRect(0, 0, width, height)
        bg.endFill()
        this.addChild(bg)

        this.help = new PIXI.Sprite(resources.help.texture)
        this.help.anchor.set(.5, .5)
        this.help.position.set(width * .5, height * .5)
        this.addChild(this.help)

        this.logo = new PIXI.Sprite(resources.logo.texture)
        this.logo.anchor.set(.5, .5)
        this.logo.position.set(width * .5, 50)
        this.addChild(this.logo)

        this.menu = new Menu({
            choices,
            itemHeight:   90,
            context:      HELP_CONTEXT,
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
        Keyboard.setContext(HELP_CONTEXT)
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
