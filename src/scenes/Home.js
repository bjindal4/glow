import Keyboard            from 'keyboardjs'
import TWEEN               from 'tween.js'
import { setCurrentScene } from '../actions'
import Menu                from '../components/core/Menu'

const { resources } = PIXI.loader

const choices = [
    {
        normal: 'playButton',
        focus:  'playButtonFocus',
        value:  'game',
    },
    {
        normal: 'settingsButton',
        focus:  'settingsButtonFocus',
        value:  'settings',
    },
    {
        normal: 'helpButton',
        focus:  'helpButtonFocus',
        value:  'help',
    },
    {
        normal: 'creditsButton',
        focus:  'creditsButtonFocus',
        value:  'credits',
    }
]

export const HOME_CONTEXT = 'home'

export default class Home extends PIXI.Container {
    constructor(store) {
        super()

        this.id = HOME_CONTEXT

        const { screen: { width, height } } = store.getState()

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
            context:      HOME_CONTEXT,
            initialValue: 'game',
            onChange:     value => {
                this.menu.setValue(value)
            },
            onConfirm:    value => {
                store.dispatch(setCurrentScene(value))
            },
        })
        this.menu.position.set(width * .5 - 160, height * .5 - 90 * 2)
        this.addChild(this.menu)

        this.visible = false

        this.enterTween = new TWEEN.Tween(this)
        this.leaveTween = new TWEEN.Tween(this)
            .onComplete(() => {
                this.visible = false
            })
    }

    willEnter() {
        Keyboard.setContext(HOME_CONTEXT)
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
