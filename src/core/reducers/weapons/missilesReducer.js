import {
    MISSILES_UP,
    MISSILE_FIRE,
    MISSILES_UPDATE,
    WEAPONS_PROJECTILES_CLEAR,
} from '../../actions'

export default function missiles(state, action) {
    switch (action.type) {
        case MISSILES_UP:
            return {
                ...state,
                level: state.level + 1,
            }

        case MISSILE_FIRE:
            return {
                ...state,
                projectiles: [
                    ...state.projectiles,
                    action.missile,
                ],
            }

        case MISSILES_UPDATE:
            return {
                ...state,
                projectiles: action.missiles,
            }

        case WEAPONS_PROJECTILES_CLEAR:
            return {
                ...state,
                projectiles: [],
            }

        default:
            return state
    }
}
