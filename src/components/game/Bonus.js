import TWEEN                       from 'tween.js'
import Popup                       from './Popup'
import { spawnPopup, removePopup } from '../../actions'

export const BONUS_TYPE_SHOT    = 'BONUS_TYPE_SHOT'
export const BONUS_TYPE_MISSILE = 'BONUS_TYPE_MISSILE'
export const BONUS_TYPE_SHIELD  = 'BONUS_TYPE_SHIELD'

const types = {
    [BONUS_TYPE_SHOT]:    {
        id:    BONUS_TYPE_SHOT,
        img:   'bonusShot',
        label: 'shot level up',
        color: '#9ced45',
    },
    [BONUS_TYPE_MISSILE]: {
        id:    BONUS_TYPE_MISSILE,
        img:   'bonusMissile',
        label: 'missile',
        color: '#e94dc8',
    },
    [BONUS_TYPE_SHIELD]:  {
        id:    BONUS_TYPE_SHIELD,
        img:   'bonusShot',
        label: 'shield',
        color: '#9ced45',
    },
}

const { resources } = PIXI.loader

export default class Bonus extends PIXI.Container {
    constructor(store, typeId) {
        super()

        this.type  = types[typeId]
        this.store = store

        this.hitRect = {
            x:      -18,
            y:      -18,
            width:  36,
            height: 36,
        }

        this.vy = 3

        this.haveBeenPickedUp = false
        this.shouldBeRemoved  = false

        this.icon = new PIXI.Sprite(resources[this.type.img].texture)
        this.icon.anchor.set(.5, .5)
        this.addChild(this.icon)

        const self = this

        this.deadTween = new TWEEN.Tween({ scale: 1, alpha: 1 })
            .to({ scale: 1.8, alpha: 0 }, 400)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () {
                self.icon.scale.x = this.scale
                self.icon.scale.y = this.scale
                self.icon.alpha   = this.alpha
            })
            .onComplete(() => {
                self.shouldBeRemoved = true
            })
    }

    destroy() {
        this.deadTween.stop()
        delete this.deadTween

        super.destroy()
    }

    pickedUp() {
        this.haveBeenPickedUp = true
        this.vy               = 0

        const popup = Popup.fromText(this.type.label, this.type.color)
        popup.position.set(this.x, this.y)
        this.store.dispatch(spawnPopup(popup))

        this.deadTween.start()
    }

    tick() {
        this.y += this.vy
    }
}
