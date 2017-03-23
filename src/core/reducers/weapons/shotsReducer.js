import {
    SHOTS_UP,
    SHOT_FIRE,
    SHOTS_UPDATE,
    WEAPONS_PROJECTILES_CLEAR,
} from '../../actions'

export default function shots(state, action) {
    switch (action.type) {
        case SHOTS_UP:
            return {
                ...state,
                level: state.level + 1,
            }

        case SHOT_FIRE:
            return {
                ...state,
                projectiles: [
                    ...state.projectiles,
                    action.shot,
                ],
            }

        case SHOTS_UPDATE:
            return {
                ...state,
                projectiles: action.shots,
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
