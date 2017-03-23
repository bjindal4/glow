import {
    SPAWN_ENEMY, REMOVE_ENEMY, ENEMY_UPDATE,
    SPAWN_ENEMY_PROJECTILE, REMOVE_ENEMY_PROJECTILE,
    ENEMIES_PROJECTILES_UPDATE,
    ENEMY_HIT, ENEMY_DEATH,
    ENEMIES_CLEAR,
} from '../actions'

export default function enemies(state = {
    items:       [],
    projectiles: [],
}, action) {
    switch (action.type) {
        case SPAWN_ENEMY:
            return {
                ...state,
                items: [
                    ...state.items,
                    action.enemy,
                ],
            }

        case REMOVE_ENEMY:
            return {
                ...state,
                items: state.items.filter(i => i.id !== action.id),
            }

        case ENEMY_UPDATE:
            return {
                ...state,
                items: state.items.map(enemy => {
                    if (enemy.id !== action.enemy.id) return enemy

                    return {
                        ...enemy,
                        ...action.enemy,
                    }
                })
            }

        case ENEMY_HIT:
            return {
                ...state,
                items: state.items.map(enemy => {
                    if (enemy.id !== action.enemy.id) return enemy

                    return {
                        ...enemy,
                        health:   Math.max(0, enemy.health - action.damage),
                        hitCount: enemy.hitCount + 1,
                    }
                })
            }

        case ENEMY_DEATH:
            return {
                ...state,
                items: state.items.map(enemy => {
                    if (enemy.id !== action.id) return enemy

                    return {
                        ...enemy,
                        health: 0,
                        vx:     0,
                        vy:     0,
                    }
                })
            }

        case ENEMIES_CLEAR:
            return {
                ...state,
                items: [],
            }

        case SPAWN_ENEMY_PROJECTILE:
            return {
                ...state,
                projectiles: [
                    ...state.projectiles,
                    action.projectile,
                ],
            }

        case REMOVE_ENEMY_PROJECTILE:
            return {
                ...state,
                projectiles: state.projectiles.filter(i => i.id !== action.item.id),
            }

        case ENEMIES_PROJECTILES_UPDATE:
            return {
                ...state,
                projectiles: action.projectiles,
            }

        default:
            return state
    }
}