import {
    FIRING_ON,
    FIRING_OFF,
    SHOTS_UP,
    MISSILES_UP,
    WEAPONS_SHIELD_ON,
    WEAPONS_SHIELD_OFF,
    WEAPONS_RESET,
    SHOT_FIRE,
    SHOTS_UPDATE,
    MISSILE_FIRE,
    MISSILES_UPDATE,
    WEAPONS_PROJECTILES_CLEAR,
} from '../../actions'
import shots    from './shotsReducer'
import missiles from './missilesReducer'

const SHOTS_DEFAULT = {
    level:       1,
    projectiles: [],
}

const MISSILES_DEFAULT = {
    level:       0,
    projectiles: [],
}

const SHIELD_DEFAULT = {
    isEnabled: false,
}

export default function weapons(state = {
    isFiring: false,
    shots:    { ...SHOTS_DEFAULT    },
    missiles: { ...MISSILES_DEFAULT },
    shield:   { ...SHIELD_DEFAULT   },
}, action) {
    switch (action.type) {
        case FIRING_ON:
            return {
                ...state,
                isFiring: true,
            }

        case FIRING_OFF:
            return {
                ...state,
                isFiring: false,
            }

        case SHOTS_UP:
        case SHOT_FIRE:
        case SHOTS_UPDATE:
            return { ...state, shots: shots(state.shots, action) }

        case MISSILES_UP:
        case MISSILE_FIRE:
        case MISSILES_UPDATE:
            return { ...state, missiles: missiles(state.missiles, action) }

        case WEAPONS_PROJECTILES_CLEAR:
            return {
                ...state,
                shots:    shots(state.shots, action),
                missiles: missiles(state.missiles, action),
            }

        case WEAPONS_SHIELD_ON:
            return {
                ...state,
                shield: {
                    ...state.shield,
                    isEnabled: true,
                },
            }

        case WEAPONS_SHIELD_OFF:
            return {
                ...state,
                shield: {
                    ...state.shield,
                    isEnabled: false,
                },
            }

        case WEAPONS_RESET:
            return {
                ...state,
                shots:    { ...SHOTS_DEFAULT    },
                missiles: { ...MISSILES_DEFAULT },
                shield:   { ...SHIELD_DEFAULT  },
            }

        default:
            return state
    }
}