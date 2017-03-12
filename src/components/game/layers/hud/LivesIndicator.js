import _     from 'lodash'
import TWEEN from 'tween.js'

const { resources } = PIXI.loader

export default class LivesIndicator extends PIXI.Container {
    constructor() {
        super()

        this.lives      = 0
        this.livesItems = []

        this.legend = new PIXI.Text('lives', {
            fontFamily: 'Arial',
            fontSize:   12,
            fill:       '#9c4b99',
            align:      'left',
        })
        this.addChild(this.legend)

        const line = new PIXI.Graphics()
        line.y     = 22
        line.beginFill(0x9c4b99)
        line.drawRect(0, 0, 260, 1)
        line.endFill()
        this.addChild(line)
    }

    addLife() {
        const life = new PIXI.Sprite(resources.life.texture)
        life.alpha = 0
        life.y     = -40

        this.addChild(life)
        this.livesItems.push(life)

        const tween = new TWEEN.Tween(life)
            .to({ y: 0, alpha: 1 }, 300)

        tween.start()
    }

    removeLife(life) {
        const tween = new TWEEN.Tween(life)
            .to({ alpha: 0, y: -40 }, 800)
            .onComplete(() => {
                this.removeChild(life)
            })

        tween.start()
    }

    setLives(lives) {
        if (this.lives === lives) return

        this.lives = lives

        const actualItemsCount = this.livesItems.length
        if (actualItemsCount > lives) {
            this.livesItems = this.livesItems.filter((life, index) => {
                if (index >= lives) {
                    this.removeLife(life)
                    return false
                }
                return true
            })
        } else {
            const createCount = lives - actualItemsCount
            _.range(createCount).forEach(() => {
                this.addLife()
            })
        }

        this.livesItems.forEach((life, i) => {
            life.x = 260 - 22 * (i + 1)
        })
    }
}