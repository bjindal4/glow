import Emitter                       from '../../../lib/Emitter'
import { hitTestRectangle, contain } from '../../../lib/collision'
import {
    spawnBonus,
    bonusPickup,
    removeBonus,
} from '../../../actions'
import Bonus, {
    BONUS_TYPE_SHOT,
    BONUS_TYPE_MISSILE,
    BONUS_TYPE_SHIELD,
} from '../Bonus'

export default class Bonuses extends PIXI.Container {
    constructor(store) {
        super()

        this.store = store

        const { screen: { width, height } } = store.getState()

        this.screenWidth  = width
        this.screenHeight = height

        this.boundaries = {
            x:      -60,
            y:      -60,
            width:  width + 120,
            height: height + 120,
        }

        this.emitter = new Emitter(200, () => {
            const seed = Math.random()

            let bonusType
            if (seed < .5) {
                bonusType = BONUS_TYPE_SHOT
            } else if (seed < .8) {
                bonusType = BONUS_TYPE_MISSILE
            } else {
                bonusType = BONUS_TYPE_SHIELD
            }

            const bonus = new Bonus(this.store, bonusType)

            bonus.x = Math.random() * this.screenWidth
            bonus.y = -40

            this.store.dispatch(spawnBonus(bonus))
        })
    }

    tick(time, ship) {
        const { bonuses } = this.store.getState()

        bonuses.items.forEach(bonus => {
            if (!bonus.shouldBeRemoved) {
                if (contain(bonus, this.boundaries).length > 0) {
                    bonus.shouldBeRemoved = true
                } else if (!bonus.haveBeenPickedUp && hitTestRectangle(ship, bonus)) {
                    this.store.dispatch(bonusPickup(bonus))
                }
            }

            if (bonus.shouldBeRemoved) {
                return this.store.dispatch(removeBonus(bonus))
            }

            bonus.tick(time)
        })

        this.emitter.tick(time)
    }
}