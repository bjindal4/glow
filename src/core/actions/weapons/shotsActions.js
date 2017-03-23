import _                                  from 'lodash'
import Vector2D                           from 'victor'
import config, { SHOT_TYPE_BASIC }        from '../../../config'
import { rectContains, hitTestRectangle } from '../../lib/collision'
import { rotationFromDirection }          from '../../lib/orient'
import { enemyHit }                       from '../index'

export const SHOT_FIRE    = 'SHOT_FIRE'
export const SHOTS_UP     = 'SHOTS_UP'
export const SHOTS_UPDATE = 'SHOTS_UPDATE'

const SHOT_HIT_RECT = {
    x:      -3,
    y:      -3,
    width:   6,
    height:  6,
}

let shotId = 0

export const fireShot = shot => ({ type: SHOT_FIRE, shot })

const getShotsConfig = _.memoize(
    (level, direction) => {
        const shotsConfig = config.weapons.shots[level - 1].config

        const rotation = rotationFromDirection(direction)

        return shotsConfig.map(({ position, velocity }) => {
            if (rotation === 0) return { position, velocity }

            return {
                position: Vector2D.fromObject(position).rotate(rotation),
                velocity: Vector2D.fromObject(velocity).rotate(rotation),
            }
        })
    },
    (...args) => args.join('.')
)

export const shouldFireShot = () => {
    return (dispatch, getState) => {
        const {
            game:    { time, direction },
            weapons: { shots },
            ship:    { x: shipX, y: shipY },
        } = getState()

        const { speed: shotsInterval } = config.weapons.shots[shots.level - 1]

        if (time % shotsInterval === 0) {
            getShotsConfig(shots.level, direction).forEach(({
                position: { x, y },
                velocity: { x: vx, y: vy },
            }) => {
                const shot = {
                    id:      shotId++,
                    type:    SHOT_TYPE_BASIC,
                    hitRect: { ...SHOT_HIT_RECT },
                    x:       shipX + x,
                    y:       shipY + y,
                    vx, vy,
                }

                dispatch(fireShot(shot))
            })
        }
    }
}

export const updateShots = () => {
    return (dispatch, getState) => {
        const {
            weapons: { shots: { projectiles: shots } },
            enemies: { items: enemies },
            screen:  { outerFrame },
        } = getState()

        const aliveEnemies = enemies.filter(e => e.health > 0)

        const updatedShots = []
        shots.forEach(shot => {
            // remove off-screen shots
            if (!rectContains(outerFrame, shot)) return

            const updatedShot = {
                ...shot,
                x: shot.x + shot.vx,
                y: shot.y + shot.vy,
            }

            // remove used projectiles
            if (aliveEnemies.some(enemy => {
                if (hitTestRectangle(updatedShot, enemy)) {
                    dispatch(enemyHit(enemy, 10))
                    return true
                }
            })) return

            updatedShots.push(updatedShot)
        })

        dispatch({ type: SHOTS_UPDATE, shots: updatedShots })
    }
}

export const increaseShotLevel = () => {
    return (dispatch, getState) => {
        const { weapons: { shots: { level } } } = getState()
        if (level < config.weapons.shots.length) {
            dispatch({ type: SHOTS_UP })
        }
    }
}
