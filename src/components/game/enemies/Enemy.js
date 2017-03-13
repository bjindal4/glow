import Popup                        from '../Popup'
import { spawnRewards, spawnPopup } from '../../../actions'

export default class Enemy extends PIXI.Container {
    constructor(store) {
        super()

        this.store = store

        this.isDead          = false
        this.shouldBeRemoved = false
    }

    spawnPoints(color) {
        const popup = Popup.fromText(`+${this.points}`, color)
        popup.position.set(this.x, this.y)

        this.store.dispatch(spawnPopup(popup))
    }

    spawnRewards(count) {
        this.store.dispatch(spawnRewards(this.x, this.y, count))
    }

    hit(damage) {
        this.health -= damage
        if (this.health <= 0) this.die()
    }

    die() {
        this.isDead = true
    }
}