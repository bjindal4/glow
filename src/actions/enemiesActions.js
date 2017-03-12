import sounds            from '../sounds'
import { increaseScore } from './playerActions'

export const SPAWN_ENEMY             = 'SPAWN_ENEMY'
export const REMOVE_ENEMY            = 'REMOVE_ENEMY'
export const SPAWN_ENEMY_PROJECTILE  = 'SPAWN_ENEMY_AMMO'
export const REMOVE_ENEMY_PROJECTILE = 'REMOVE_ENEMY_PROJECTILE'

export const spawnEnemy            = item => ({ type: SPAWN_ENEMY,             item, layer: 'game.main' })
export const removeEnemy           = item => ({ type: REMOVE_ENEMY,            item, layer: 'game.main' })
export const spawnEnemyProjectile  = item => ({ type: SPAWN_ENEMY_PROJECTILE,  item, layer: 'game.main' })
export const removeEnemyProjectile = item => ({ type: REMOVE_ENEMY_PROJECTILE, item, layer: 'game.main' })

export const enemyHit = (enemy, weapon) => {
    return dispatch => {
        weapon.die()
        enemy.hit(weapon.damage)

        if (enemy.isDead) {
            sounds.explosion.play()
            dispatch(increaseScore(enemy.points))
        }
    }
}

export const clearEnemies = () => {
    return (dispatch, getState) => {
        const { enemies: { items } } = getState()
        items.forEach(item => {
            dispatch(removeEnemy(item))
        })
    }
}

export const clearEnemiesProjectiles = () => {
    return (dispatch, getState) => {
        const { enemies: { projectiles } } = getState()
        projectiles.forEach(projectile => {
            dispatch(removeEnemyProjectile(projectile))
        })
    }
}
