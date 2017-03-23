import _          from 'lodash'
import Keyboard   from 'keyboardjs'
import TWEEN      from 'tween.js'
import sounds     from '../../../../resources/sounds'
import MenuCursor from './MenuCursor'

const { resources } = PIXI.loader

export default class Menu extends PIXI.Container {
    constructor({
        choices,
        context,
        itemHeight,
        initialValue,
        onChange,
        onConfirm,
    }) {
        super()

        this.choices      = choices
        this.currentValue = initialValue
        this.itemHeight   = itemHeight

        this.choicesItems = []
        this.choices.forEach((choice, i) => {
            const resourceId = choice.value === initialValue ? choice.focus : choice.normal
            const choiceItem = new PIXI.Sprite(resources[resourceId].texture)
            choiceItem.y = i * itemHeight
            this.addChild(choiceItem)
            this.choicesItems.push(choiceItem)
        })

        const currentIndex = _.findIndex(this.choices, { value: this.currentValue })

        this.cursor = new MenuCursor()
        this.cursor.position.set(-24, currentIndex * itemHeight + itemHeight * .5)
        this.addChild(this.cursor)

        this.cursorTween = new TWEEN.Tween(this.cursor)
        this.cursorTween.easing(TWEEN.Easing.Exponential.Out)

        Keyboard.withContext(context, () => {
            Keyboard.bind(['up'], () => {
                const currentIndex = _.findIndex(this.choices, { value: this.currentValue })
                if (currentIndex === 0) {
                    onChange(_.last(this.choices).value)
                } else {
                    onChange(this.choices[currentIndex - 1].value)
                }
            })
            Keyboard.bind(['down'], () => {
                const currentIndex = _.findIndex(this.choices, { value: this.currentValue })
                if (currentIndex > this.choices.length - 2) {
                    onChange(this.choices[0].value)
                } else {
                    onChange(this.choices[currentIndex + 1].value)
                }
            })

            Keyboard.bind(['space', 'enter'], () => {
                onConfirm(this.currentValue)
                sounds.confirm.play()
            })
        })
    }

    setValue(value) {
        if (value === this.currentValue) return

        sounds.click.play()

        this.currentValue  = value
        const currentIndex = _.findIndex(this.choices, { value: this.currentValue })

        this.choices.forEach((choice, i) => {
            const resourceId = choice.value === value ? choice.focus : choice.normal
            const choiceItem = this.choicesItems[i]
            choiceItem.texture = resources[resourceId].texture
        })

        this.cursorTween.to({ y: currentIndex * this.itemHeight + this.itemHeight * .5 }, 600)
        this.cursorTween.start()
    }
}
