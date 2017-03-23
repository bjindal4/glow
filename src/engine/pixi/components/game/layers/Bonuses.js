import EntityPool from 'core/lib/EntityPool'
import Bonus      from '../Bonus'

export default class Bonuses extends PIXI.Container {
    constructor(removeBonus) {
        super()

        this.pool = new EntityPool({
            create: b => {
                const bonus = new Bonus(b, removeBonus)
                bonus.position.set(b.x, b.y)
                this.addChild(bonus)

                return bonus
            },
            update: (bonus, next) => {
                bonus.position.set(next.x, next.y)
                bonus.pickedUp = next.pickedUp
            },
            remove: stale => {
                //stale.visible = false
            },
            recycle: (old, bonus) => {
                old.id = bonus.id
                old.position.set(bonus.x, bonus.y)
                old.type = bonus.type
                old.reset()
            },
        })
    }

    update(bonuses) {
        this.pool.update(bonuses)
    }
}