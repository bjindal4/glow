import _        from 'lodash'
import asteroid from './Asteroid'
import saucer   from './Saucer'

const poolByEnemyType = {
    asteroid,
    saucer,
}

export default class Enemies {
    constructor(scene, store) {
        this.scene = scene
        this.store = store

        this.pools = {}
    }

    update(enemies, transpose) {
        const enemiesByType = _.groupBy(enemies, 'type')

        Object.keys(enemiesByType).forEach(type => {
            if (!this.pools[type]) {
                this.pools[type] = poolByEnemyType[type](this.scene, this.store)
            }

            this.pools[type].update(enemiesByType[type], transpose)
        })
    }
}