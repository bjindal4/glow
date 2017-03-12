import {
    SPAWN_ENEMY, REMOVE_ENEMY,
    SPAWN_ENEMY_PROJECTILE, REMOVE_ENEMY_PROJECTILE,
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
                    action.item,
                ],
            }

        case REMOVE_ENEMY:
            return {
                ...state,
                items: state.items.filter(i => i.id !== action.item.id),
            }

        case SPAWN_ENEMY_PROJECTILE:
            return {
                ...state,
                projectiles: [
                    ...state.projectiles,
                    action.item,
                ],
            }

        case REMOVE_ENEMY_PROJECTILE:
            return {
                ...state,
                projectiles: state.projectiles.filter(i => i.id !== action.item.id),
            }

        default:
            return state
    }
}