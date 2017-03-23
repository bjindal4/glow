import EntityPool        from 'core/lib/EntityPool'
import { Shot, Missile } from '../weapons'

export default class Weapons extends PIXI.Container {
    constructor() {
        super()

        const shotsPool = new EntityPool({
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

        const missilesPool = new EntityPool({
            create: m => {
                const missile = new Missile(m)
                missile.position.set(m.x, m.y)
                missile.rotation = m.rotation
                this.addChild(missile)

                return missile
            },
            update: (missile, next) => {
                missile.position.set(next.x, next.y)
                missile.rotation = next.rotation
            },
            remove: stale => {
                stale.visible = false
            },
            recycle: (old, missile) => {
                old.id = missile.id
                old.position.set(missile.x, missile.y)
                old.rotation = missile.rotation
                old.visible  = true
            },
        })

        this.pools = {
            shots:    shotsPool,
            missiles: missilesPool,
        }
    }

    update({
        shots:    { projectiles: shots    },
        missiles: { projectiles: missiles },
    }) {
        this.pools.shots.update(shots)
        this.pools.missiles.update(missiles)
    }
}