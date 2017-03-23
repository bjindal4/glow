import {
    GAME_START, GAME_STOP, GAME_PAUSE, GAME_RESUME, GAME_OVER,
    SPAWN_POPUP, REMOVE_POPUP,
    SPAWN_REWARD, REMOVE_REWARD, REWARDS_UPDATE, REWARDS_CLEAR,
    GAME_TICK,
    GAME_DIRECTION_SET,
    NIGHT_SHIFT_ENABLE, NIGHT_SHIFT_DISABLE, NIGHT_SHIFT_UPDATE,
    MOVE_CONTROL_ENABLE, MOVE_CONTROL_DISABLE, MOVE_CONTROL_DISABLE_ALL,
} from '../actions'
import {
    GAME_DIRECTION_UPWARD,
} from '../constants'

const DEFAULT_MOVE_CONTROLS = {
    up:    false,
    right: false,
    down:  false,
    left:  false,
}

export default function game(state = {
    isGameOver:   false,
    isPlaying:    false,
    isPaused:     false,
    popups:       [],
    rewards:      [],
    time:         0,
    direction:    GAME_DIRECTION_UPWARD,
    moveControls: { ...DEFAULT_MOVE_CONTROLS },
    nightShift: {
        isEnabled:     false,
        remainingTime: 0,
    }
}, action) {
    switch (action.type) {
        case GAME_START:
            return {
                ...state,
                isPlaying:  true,
                isPaused:   false,
                isGameOver: false,
            }

        case GAME_STOP:
            return {
                ...state,
                isPlaying:  false,
                isPaused:   false,
                isGameOver: false,
            }

        case GAME_TICK:
            return {
                ...state,
                time: state.time + 1,
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
            }

        case GAME_DIRECTION_SET:
            return {
                ...state,
                direction: action.direction,
            }

        case SPAWN_POPUP:
            return {
                ...state,
                popups: [
                    ...state.popups,
                    action.popup,
                ],
            }

        case REMOVE_POPUP:
            return {
                ...state,
                popups: state.popups.filter(i => i.id !== action.id),
            }

        case SPAWN_REWARD:
            return {
                ...state,
                rewards: [
                    ...state.rewards,
                    action.reward,
                ],
            }

        case REMOVE_REWARD:
            return {
                ...state,
                rewards: state.rewards.filter(i => i.id !== action.id),
            }

        case REWARDS_UPDATE:
            return {
                ...state,
                rewards: action.rewards,
            }

        case REWARDS_CLEAR:
            return {
                ...state,
                rewards: [],
            }

        case NIGHT_SHIFT_ENABLE:
            return {
                ...state,
                nightShift: {
                    ...state.nightShift,
                    isEnabled:     true,
                    remainingTime: 300,
                }
            }

        case NIGHT_SHIFT_UPDATE:
            return {
                ...state,
                nightShift: {
                    ...state.nightShift,
                    remainingTime: Math.max(0, state.nightShift.remainingTime - 1),
                }
            }

        case NIGHT_SHIFT_DISABLE:
            return {
                ...state,
                nightShift: {
                    ...state.nightShift,
                    isEnabled:     false,
                    remainingTime: 0,
                }
            }

        case MOVE_CONTROL_ENABLE:
            return {
                ...state,
                moveControls: {
                    ...state.moveControls,
                    [action.controlType]: true,
                },
            }

        case MOVE_CONTROL_DISABLE:
            return {
                ...state,
                moveControls: {
                    ...state.moveControls,
                    [action.controlType]: false,
                }
            }

        case MOVE_CONTROL_DISABLE_ALL:
            return {
                ...state,
                moveControls: { ...DEFAULT_MOVE_CONTROLS },
            }

        default:
            return state
    }
}