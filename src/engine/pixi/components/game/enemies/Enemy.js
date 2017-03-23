export default class Enemy extends PIXI.Container {
    constructor(store) {
        super()

        this.store = store
    }

    set health(health) {
        if (health === this._health) return

        this._health = health
        if (health === 0) this.die()
    }

    die() {}
}