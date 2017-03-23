import {
    SPAWN_BONUS,
    REMOVE_BONUS,
    BONUSES_UPDATE,
    BONUSES_CLEAR,
} from '../actions'

export default function bonuses(state = {
    items: [],
}, action) {
    switch (action.type) {
        case SPAWN_BONUS:
            return {
                ...state,
                items: [
                    ...state.items,
                    action.bonus,
                ],
            }

        case REMOVE_BONUS:
            return {
                ...state,
                items: state.items.filter(i => i.id !== action.id),
            }

        case BONUSES_UPDATE:
            return {
                ...state,
                items: action.bonuses,
            }

        case BONUSES_CLEAR:
            return {
                ...state,
                items: [],
            }

        default:
            return state
    }
}