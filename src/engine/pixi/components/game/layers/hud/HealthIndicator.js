import TWEEN          from 'tween.js'
import { MAX_HEALTH } from 'core/constants'

export default class HealthIndicator extends PIXI.Container {
    constructor() {
        super()

        this.health = MAX_HEALTH

        this.legend = new PIXI.Text('health', {
            fontFamily: 'Arial',
            fontSize:   12,
            fill:       '#9c4b99',
            align:      'left',
        })
        this.addChild(this.legend)

        const bg = new PIXI.Graphics()
        bg.y     = 20
        bg.beginFill(0x30142a)
        bg.drawRect(0, 0, 260, 10)
        bg.endFill()
        this.addChild(bg)

        this.bar   = new PIXI.Graphics()
        this.bar.y = 20
        this.bar.beginFill(0x9c4b99)
        this.bar.drawRect(0, 0, 260, 10)
        this.bar.endFill()
        this.addChild(this.bar)

        this.tween = new TWEEN.Tween(this.bar)
            .easing(TWEEN.Easing.Exponential.Out)
    }


    setHealth(health) {
        if (this.health === health) return

        this.health = health
        const width = Math.max(0, health / MAX_HEALTH * 260)

        this.tween.to({ width }, 600)
        this.tween.start()
    }
}