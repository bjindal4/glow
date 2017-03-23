import config from '../../../config'
import {
    rectContains,
    hitTestRectangle,
} from '../../lib/collision'
import {
    increaseScore,
    spawnPopup,
    spawnRewards,
    shipHit,
} from '../index'
import {
    GAME_DIRECTION_UPWARD,
    GAME_DIRECTION_FORWARD,
    GAME_DIRECTION_DOWNWARD,
    GAME_DIRECTION_BACKWARD,
} from '../../constants'
import { enemySalvo } from './weaponsActions'

export * from './weaponsActions'

export const SPAWN_ENEMY   = 'SPAWN_ENEMY'
export const REMOVE_ENEMY  = 'REMOVE_ENEMY'
export const ENEMY_HIT     = 'ENEMY_HIT'
export const ENEMIES_CLEAR = 'ENEMIES_CLEAR'
export const ENEMY_UPDATE  = 'ENEMY_UPDATE'
export const ENEMY_DEATH   = 'ENEMY_DEATH'

export const removeEnemy = id    => ({ type: REMOVE_ENEMY, id })
export const updateEnemy = enemy => ({ type: ENEMY_UPDATE, enemy })

// @todo if Math.random() is no more required, should be memoized
const getRandomEnemyPositionAndVelocity = (width, height, direction, speed) => {
    switch (direction) {
        case GAME_DIRECTION_UPWARD:
            return {
                position: { x: Math.random() * width, y: -40   },
                velocity: { x: 0,                     y: speed },
            }

        case GAME_DIRECTION_FORWARD:
            return {
                position: { x: width + 40, y: Math.random() * height },
                velocity: { x: -speed,     y: 0                      },
            }

        case GAME_DIRECTION_DOWNWARD:
            return {
                position: { x: Math.random() * width, y: height + 40 },
                velocity: { x: 0,                     y: -speed      },
            }

        case GAME_DIRECTION_BACKWARD:
            return {
                position: { x: -40,   y: Math.random() * height },
                velocity: { x: speed, y: 0                      },
            }
    }
}

let enemyId = 0

export const spawnEnemy = enemy => ({
    type:  SPAWN_ENEMY,
    enemy: {
        id:       enemyId++,
        age:      0,
        hitCount: 0,
        ...enemy,
    },
})

export const shouldSpawnEnemy = () => {
    return (dispatch, getState) => {
        const {
            game:   { time, direction },
            screen: { width, height },
        } = getState()

        if (time % config.enemies.saucer.spawnInterval === 0) {
            const { position, velocity } = getRandomEnemyPositionAndVelocity(width, height, direction, config.enemies.saucer.speed)

            dispatch(spawnEnemy({
                ...config.enemies.saucer.item,
                ...position,
                type: config.enemies.saucer.type,
                vx:   velocity.x,
                vy:   velocity.y,
            }))
        }

        if (time % config.enemies.asteroid.spawnInterval === 0) {
            const { position, velocity } = getRandomEnemyPositionAndVelocity(width, height, direction, config.enemies.asteroid.speed)

            dispatch(spawnEnemy({
                ...config.enemies.asteroid.item,
                ...position,
                type: config.enemies.asteroid.type,
                vx:   velocity.x,
                vy:   velocity.y,
            }))
        }
    }
}

export const updateEnemies = () => {
    return (dispatch, getState) => {
        const {
            enemies: { items: enemies },
            screen:  { outerFrame },
            game:    { time },
            ship,
        } = getState()

        enemies.forEach(enemy => {
            const updatedEnemy = {
                ...enemy,
                x:   enemy.x + enemy.vx,
                y:   enemy.y + enemy.vy,
                age: enemy.age += 1,
            }

            // remove off-screen enemies
            if (!rectContains(outerFrame, updatedEnemy)) {
                return dispatch(removeEnemy(enemy.id))
            }

            if (enemy.health > 0 && hitTestRectangle(ship, enemy)) {
                dispatch(shipHit(enemy.damage))
                dispatch(enemyDeath(enemy))
                return
            }

            const enemyConfig = config.enemies[enemy.type]
            if (enemy.health > 0  && enemyConfig.firingInterval && time % enemyConfig.firingInterval === 0) {
                dispatch(enemySalvo(enemy))
            }

            dispatch(updateEnemy(updatedEnemy))
        })
    }
}

export const enemyDeath = enemy =>  dispatch => {
    dispatch({ type: ENEMY_DEATH, id: enemy.id })
    dispatch(increaseScore(enemy.points))
    dispatch(spawnRewards(enemy.x, enemy.y, enemy.rewardsCount))
    dispatch(spawnPopup({
        x:     enemy.x,
        y:     enemy.y,
        text:  `+${enemy.points}`,
        color: '#ffffff',
    }))
}

export const enemyHit = (enemy, damage) => {
    return dispatch => {
        dispatch({ type: ENEMY_HIT, enemy, damage })
        if (enemy.health - damage <= 0) {
            dispatch(enemyDeath(enemy))
        }
    }
}
export const clearEnemies = () => ({ type: ENEMIES_CLEAR })

