import { SPAWN_BONUS, REMOVE_BONUS } from '../actions'

export default function bonuses(state = {
    items: [],
}, action) {
    switch (action.type) {
        case SPAWN_BONUS:
            return {
                ...state,
                items: [
                    ...state.items,
                    action.item,
                ],
            }

        case REMOVE_BONUS:
            return {
                ...state,
                items: state.items.filter(i => i.id !== action.item.id),
            }

        default:
            return state
    }
}