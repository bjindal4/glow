import { SET_SCENES, ADD_SCENE, SET_CURRENT_SCENE } from '../actions'

export default function scenes(state = {
    items:   [],
    current: null,
}, action) {
    switch (action.type) {
        case SET_SCENES:
            return {
                ...state,
                items: [ ...action.scenes ],
            }

        case ADD_SCENE:
            return {
                ...state,
                items: [
                    ...state.items,
                    action.scene,
                ],
            }

        case SET_CURRENT_SCENE:
            return {
                ...state,
                current: action.id,
            }

        default:
            return state
    }
}
