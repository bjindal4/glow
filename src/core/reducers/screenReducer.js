import { SET_SCREEN_DIMENSIONS } from '../actions'

const OUTER_FRAME_OFFSET = 60

export default function screen(state = {
    width:      0,
    height:     0,
    outerFrame: null,
}, action) {
    switch (action.type) {
        case SET_SCREEN_DIMENSIONS:
            return {
                ...state,
                width:      action.width,
                height:     action.height,
                outerFrame: {
                    x:      -OUTER_FRAME_OFFSET,
                    y:      -OUTER_FRAME_OFFSET,
                    width:  action.width  + OUTER_FRAME_OFFSET * 2,
                    height: action.height + OUTER_FRAME_OFFSET * 2,
                }
            }

        default:
            return state
    }
}
