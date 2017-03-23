import _                                  from 'lodash'
import Vector2D                           from 'victor'
import { rectContains, hitTestRectangle } from '../../lib/collision'
import { rotationFromDirection }          from '../../lib/orient'
import { attractor }                      from '../../lib/forces'
import config                             from '../../../config'
import { enemyHit }                       from '../index'

export const MISSILE_FIRE           = 'MISSILE_FIRE'
export const MISSILES_UP            = 'MISSILES_UP'
export const MISSILES_EMIT_INTERVAL = 30
export const MISSILES_UPDATE        = 'MISSILES_UPDATE'

const MISSILE_HIT_RECT = {
    x:      -3,
    y:      -3,
    width:   6,
    height:  6,
}

let missileId = 0

export const fireMissile = missile => ({ type: MISSILE_FIRE, missile })

const getMissilesConfig = _.memoize(
    (level, direction) => {
        const missilesConfig = config.weapons.missiles[level - 1]

        const rotation = rotationFromDirection(direction)

        return missilesConfig.map(({ position, velocity }) => {
            if (rotation === 0) return { position, velocity }

            return {
                position: Vector2D.fromObject(position).rotate(rotation),
                velocity: Vector2D.fromObject(velocity).rotate(rotation),
            }
        })
    },
    (...args) => args.join('.')
)

export const shouldFireMissile = () => {
    return (dispatch, getState) => {
        const {
            game:    { time, direction },
            weapons: { missiles },
            ship:    { x: shipX, y: shipY },
        } = getState()

        if (missiles.level > 0 && time % MISSILES_EMIT_INTERVAL === 0) {
            getMissilesConfig(missiles.level, direction).forEach(({
                position: { x, y },
                velocity: { x: vx, y: vy },
            }) => {
                const missile = {
                    id:      missileId++,
                    x:       shipX + x,
                    y:       shipY + y,
                    hitRect: { ...MISSILE_HIT_RECT },
                    vx, vy,
                }
                dispatch(fireMissile(missile))
            })
        }
    }
}

const attract = attractor({
    distance: 260,
    speed:    16,
})

export const updateMissiles = () => {
    return (dispatch, getState) => {
        const {
            weapons: { missiles: { projectiles: missiles } },
            enemies: { items: enemies },
            screen:  { outerFrame },
        } = getState()

        const aliveEnemies = enemies.filter(e => e.health > 0)

        const updatedMissiles = []
        missiles.forEach(missile => {
            // remove off-screen missiles
            if (!rectContains(outerFrame, missile)) return

            const velocityVector = new Vector2D(missile.vx, missile.vy)
            const rotation       = velocityVector.horizontalAngle() + Math.PI * .5
            const { vx, vy }     = attract(missile, aliveEnemies)

            const updatedMissile = {
                ...missile,
                vx, vy,
                x: missile.x + vx,
                y: missile.y + vy,
                rotation,
            }

            // remove used projectiles
            if (aliveEnemies.some(enemy => {
                if (hitTestRectangle(updatedMissile, enemy)) {
                    dispatch(enemyHit(enemy, 20))
                    return true
                }
            })) return

            updatedMissiles.push(updatedMissile)
        })

        dispatch({ type: MISSILES_UPDATE, missiles: updatedMissiles })
    }
}

export const increaseMissilesLevel = () => {
    return (dispatch, getState) => {
        const { weapons: { missiles: { level } } } = getState()
        if (level < config.weapons.missiles.length) {
            dispatch({ type: MISSILES_UP })
        }
    }
}
