import TWEEN from 'tween.js'

export default class Popup extends PIXI.Container {
    static fromText(text, color) {
        const textGraphic = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize:   18,
            fill:       color,
            align:      'center',
        })
        textGraphic.anchor.set(.5, .5)

        return new Popup(textGraphic)
    }

    constructor(graphic) {
        super()

        this.graphic = graphic
        this.addChild(this.graphic)

        this.visible = false
    }

    set text(text) {
        this.graphic.text = text
    }

    set color(color) {
        this.graphic.style = {
            ...this.graphic.style,
            fill: color,
        }
    }

    pop(onComplete) {
        const graphic = this.graphic

        graphic.scale.set(0, 0)
        graphic.alpha = 0

        this.visible = true

        const appearTween = new TWEEN.Tween({ scale: 0, alpha: 0, y: 60 })
            .to({ scale: 1, alpha: 1, y: -40 }, 600)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () {
                graphic.scale.set(this.scale, this.scale)
                graphic.alpha = this.alpha
                graphic.y     = this.y
            })

        const disappearTween = new TWEEN.Tween({ scaleX: 1, scaleY: 1, alpha: 1, y: -40 })
            .to({ scaleX: .4, scaleY: 3, alpha: 0, y: -140 }, 600)
            .easing(TWEEN.Easing.Exponential.In)
            .onUpdate(function () {
                graphic.scale.x = this.scaleX
                graphic.scale.y = this.scaleY
                graphic.alpha   = this.alpha
                graphic.y       = this.y
            })
            .onComplete(onComplete)

        appearTween.chain(disappearTween)
        appearTween.start()
    }
}
