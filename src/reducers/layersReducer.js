import { REGISTER_LAYER } from '../actions'

export default function layers(state = {}, action) {
    switch (action.type) {
        case REGISTER_LAYER:
            return {
                ...state,
                [action.id]: action.layer,
            }

        default:
            return state
    }
}
