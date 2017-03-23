import {
    SHIP_VELOCITY_UPDATE,
    SHIP_POSITION_UPDATE,
} from '../actions'

export default function ship(state = {
    x:       0,
    y:       0,
    vx:      0,
    vy:      0,
    hitRect: {
        x:      -20,
        y:      -20,
        width:   40,
        height:  40,
    },
}, action) {
    switch (action.type) {
        case SHIP_VELOCITY_UPDATE:
            return {
                ...state,
                [`v${action.component}`]: action.value
            }

        case SHIP_POSITION_UPDATE:
            return {
                ...state,
                x: action.x,
                y: action.y,
            }

        default:
            return state
    }
}
