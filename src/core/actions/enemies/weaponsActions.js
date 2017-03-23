import Vector2d from 'victor'
import config   from '../../../config'
import {
    rectContains,
    hitTestRectangle,
} from '../../lib/collision'
import {
    rotationFromDirection,
} from '../../lib/orient'
import {
    shipHit,
} from '../playerActions'

export const SPAWN_ENEMY_PROJECTILE     = 'SPAWN_ENEMY_AMMO'
export const REMOVE_ENEMY_PROJECTILE    = 'REMOVE_ENEMY_PROJECTILE'
export const ENEMIES_PROJECTILES_UPDATE = 'ENEMIES_PROJECTILES_UPDATE'

const rotateSalvo = (salvo, direction) => salvo.map(shot => {
    const velocity = new Vector2d(shot.vx, shot.vy)
    velocity.rotate(rotationFromDirection(direction))

    return {
        ...shot,
        vx: velocity.x,
        vy: velocity.y,
    }
})

export const enemySalvo = enemy => {
    return (dispatch, getState) => {
        const { game: { direction } } = getState()
        const enemyConfig = config.enemies[enemy.type]

        let shots = enemyConfig.salvo(enemy)
        if (enemyConfig.orientShots === true) {
            shots = rotateSalvo(shots, direction)
        }

        shots.forEach(shot => {
            dispatch(spawnEnemyProjectile(shot))
        })
    }
}

let projectileId = 0

export const spawnEnemyProjectile = projectile => {
    return {
        type: SPAWN_ENEMY_PROJECTILE,
        projectile: {
            id: projectileId++,
            ...projectile,
        }
    }
}

export const updateEnemiesProjectiles = () => (dispatch, getState) => {
    const {
        ship,
        enemies: { projectiles },
        screen:  { outerFrame },
    } = getState()

    const updatedProjectiles = []
    projectiles.forEach(projectile => {
        // remove off-screen projectiles
        if (!rectContains(outerFrame, projectile)) return

        const updatedProjectile = {
            ...projectile,
            x: projectile.x + projectile.vx,
            y: projectile.y + projectile.vy,
        }

        if (hitTestRectangle(ship, {
            ...updatedProjectile,
            width:  3,
            height: 3,
        })) {
            dispatch(shipHit(10))
            return
        }

        updatedProjectiles.push(updatedProjectile)
    })

    dispatch({ type: ENEMIES_PROJECTILES_UPDATE, projectiles: updatedProjectiles })
}

export const removeEnemyProjectile = item => ({ type: REMOVE_ENEMY_PROJECTILE, item })

export const clearEnemiesProjectiles = () => {
    return (dispatch, getState) => {
        const { enemies: { projectiles } } = getState()
        projectiles.forEach(projectile => {
            dispatch(removeEnemyProjectile(projectile))
        })
    }
}
