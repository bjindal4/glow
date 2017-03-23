import EntityPool from 'core/lib/EntityPool'
import { Shot }   from '../weapons'

export default class EnemiesWeapons extends PIXI.Container {
    constructor() {
        super()

        this.pool = new EntityPool({
            create: s => {
                const shot = new Shot(s)
                shot.position.set(s.x, s.y)
                this.addChild(shot)

                return shot
            },
            update: (shot, next) => {
                shot.position.set(next.x, next.y)
            },
            remove: stale => {
                stale.visible = false
            },
            recycle: (old, shot) => {
                old.id = shot.id
                old.position.set(shot.x, shot.y)
                old.visible = true
            },
        })
    }

    update(projectiles) {
        this.pool.update(projectiles)
    }
}