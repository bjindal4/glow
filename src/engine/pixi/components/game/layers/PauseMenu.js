import Keyboard from 'keyboardjs'
import TWEEN    from 'tween.js'
import Menu     from '../../core/Menu'

const choices = [
    {
        normal: 'resumeButton',
        focus:  'resumeButtonFocus',
        value:  'resume',
    },
    {
        normal: 'quitButton',
        focus:  'quitButtonFocus',
        value:  'quit',
    },
]

export default class PauseMenu extends PIXI.Container {
    constructor(width, height, onConfirm) {
        super()

        this.menu = new Menu({
            choices,
            itemHeight:   90,
            context:      'pauseMenu',
            initialValue: 'resume',
            onChange:     value => {
                this.menu.setValue(value)
            },
            onConfirm,
        })
        this.menu.position.set(width * .5 - 160, height * .5 - 90)
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
        Keyboard.setContext('pauseMenu')
        this.visible = true
        this.enterTween.to({ alpha: 1 }, 400)
        this.enterTween.start()
    }

    willLeave() {
        this.leaveTween.to({ alpha: 0 }, 400)
        this.leaveTween.start()
    }

    tick() {

    }
}
