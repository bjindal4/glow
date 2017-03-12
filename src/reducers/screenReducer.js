import { SET_SCREEN_DIMENSIONS } from '../actions'

export default function screen(state = {
    width:  0,
    height: 0,
}, action) {
    switch (action.type) {
        case SET_SCREEN_DIMENSIONS:
            return {
                ...state,
                width:  action.width,
                height: action.height,
            }

        default:
            return state
    }
}
