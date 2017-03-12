import {
    FIRING_ON,
    FIRING_OFF,
    WEAPONS_SHOT_UP,
    WEAPONS_MISSILES_UP,
    WEAPONS_SHIELD_ON,
    WEAPONS_SHIELD_OFF,
    WEAPONS_RESET,
    SPAWN_PROJECTILE,
    REMOVE_PROJECTILE,
} from '../actions'

const SHOT_DEFAULT = {
    level: 1,
}

const MISSILES_DEFAULT = {
    level: 0,
}

const SHIELD_DEFAULT = {
    isEnabled: false,
}

export default function weapons(state = {
    isFiring:    false,
    shot:        { ...SHOT_DEFAULT     },
    missiles:    { ...MISSILES_DEFAULT },
    shield:      { ...SHIELD_DEFAULT   },
    projectiles: [],
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

        case WEAPONS_SHOT_UP:
            return {
                ...state,
                shot: {
                    ...state.shot,
                    level: state.shot.level + 1,
                },
            }

        case WEAPONS_MISSILES_UP:
            return {
                ...state,
                missiles: {
                    ...state.missiles,
                    level: state.missiles.level + 1,
                },
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

        case SPAWN_PROJECTILE:
            return {
                ...state,
                projectiles: [
                    ...state.projectiles,
                    action.item,
                ],
            }

        case REMOVE_PROJECTILE:
            return {
                ...state,
                projectiles: state.projectiles.filter(i => i.id !== action.item.id),
            }


        case WEAPONS_RESET:
            return {
                ...state,
                shot:     { ...SHOT_DEFAULT    },
                missiles: { ...MISSILES_DEFAULT },
                shield:   { ...SHIELD_DEFAULT  },
            }

        default:
            return state
    }
}