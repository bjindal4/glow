import _      from 'lodash'
import TWEEN  from 'tween.js'
import config from '../../../../../../config'

const { resources } = PIXI.loader

const spacing   = 3
const itemWidth = (260 - (config.weapons.shots.length - 1) * spacing) / config.weapons.shots.length

export default class ShotsLevelIndicator extends PIXI.Container {
    constructor() {
        super()

        this.currentLevel = 0

        this.icon = new PIXI.Sprite(resources.shotsIcon.texture)
        this.icon.anchor.set(1, 0)
        this.icon.x = 260
        this.icon.y = 3
        this.addChild(this.icon)

        this.legend = new PIXI.Text('shot level', {
            fontFamily: 'Arial',
            fontSize:   12,
            fill:       '#54b053',
            align:      'left',
        })
        this.addChild(this.legend)

        _.range(config.weapons.shots.length).forEach(i => {
            const part = new PIXI.Graphics()
            part.x = i * itemWidth + i * spacing
            part.y = 20
            part.beginFill(0x2e3e2b)
            part.drawRect(0, 0, itemWidth, 10)
            part.endFill()
            this.addChild(part)
        })

        this.items = []
    }

    addItem() {
        const item = new PIXI.Graphics()
        item.beginFill(0x70db6e)
        item.drawRect(0, 0, itemWidth, 10)
        item.endFill()
        item.scale.x = 0
        item.y       = 20

        this.addChild(item)
        this.items.push(item)

        const tween = new TWEEN.Tween({ scale: 0 })
            .to({ scale: 1 }, 800)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function () {
                item.scale.x = this.scale
            })

        tween.start()
    }

    removeItem(item) {
        const tween = new TWEEN.Tween({ scale: 1 })
            .to({ scale: 0 }, 800)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function () {
                item.scale.x = this.scale
            })
            .onComplete(() => {
                this.removeChild(item)
            })

        tween.start()
    }

    set level(level) {
        if (level === this.currentLevel) return

        this.currentLevel = level

        const actualItemsCount = this.items.length
        if (actualItemsCount > this.currentLevel) {
            this.items = this.items.filter((item, index) => {
                if (index >= this.currentLevel) {
                    this.removeItem(item)
                    return false
                }
                return true
            })
        } else {
            const createCount = this.currentLevel - actualItemsCount
            _.range(createCount).forEach(() => {
                this.addItem()
            })
        }

        this.items.forEach((item, i) => {
            item.x = i * itemWidth + i * spacing
        })
    }
}