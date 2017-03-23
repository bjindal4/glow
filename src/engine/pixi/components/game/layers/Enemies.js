import _                   from 'lodash'
import { poolByEnemyType } from '../enemies'

export default class Enemies extends PIXI.Container {
    constructor() {
        super()

        this.pools = {}
    }

    update(enemies) {
        const enemiesByType = _.groupBy(enemies, 'type')

        Object.keys(enemiesByType).forEach(type => {
            if (!this.pools[type]) {
                this.pools[type] = poolByEnemyType[type](this)
            }

            this.pools[type].update(enemiesByType[type])
        })
    }
}