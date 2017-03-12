import {
    GAME_START, GAME_PAUSE, GAME_RESUME, GAME_OVER,
    SPAWN_POPUP, REMOVE_POPUP,
    SPAWN_REWARD, REMOVE_REWARD,
} from '../actions'

export default function game(state = {
    isGameOver: false,
    isPlaying:  false,
    isPaused:   false,
    popups:     [],
    rewards:    [],
}, action) {
    switch (action.type) {
        case GAME_START:
            return {
                ...state,
                isPlaying:  true,
                isPaused:   false,
                isGameOver: false,
            }

        case GAME_PAUSE:
            return {
                ...state,
                isPaused: true,
            }

        case GAME_RESUME:
            return {
                ...state,
                isPaused: false,
            }

        case GAME_OVER:
            return {
                ...state,
                isPlaying:  false,
                isGameOver: true,
                isPaused:   true,
            }

        case SPAWN_POPUP:
            return {
                ...state,
            }

        case REMOVE_POPUP:
            return {
                ...state,
            }

        case SPAWN_REWARD:
            return {
                ...state,
                rewards: [
                    ...state.rewards,
                    action.item,
                ],
            }

        case REMOVE_REWARD:
            return {
                ...state,
                rewards: state.rewards.filter(i => i.id !== action.item.id),
            }

        default:
            return state
    }
}