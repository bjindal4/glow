import {
    SETTING_SET,
} from '../actions'

const DEFAULT_SETTINGS = {
    isSoundEnabled: true,
}

export default function settings(state = {
    ...DEFAULT_SETTINGS,
}, action) {
    switch (action.type) {
        case SETTING_SET:
            return {
                ...state,
            }

        default:
            return state
    }
}
