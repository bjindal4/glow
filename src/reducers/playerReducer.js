import {
    SHIP_HIT, MAX_HEALTH,
    GAME_OVER, PLAYER_DEATH,
    SCORE_UP, SCORE_RESET,
    PLAYER_HEALTH_RESET,
    PLAYER_LIVES_RESET,
} from '../actions'

export const MAX_LIVES = 3

export default function player(state = {
    health:  MAX_HEALTH,
    score:   0,
    lives:   MAX_LIVES,
    dead:    false,
}, action) {
    switch (action.type) {
        case SHIP_HIT:
            return {
                ...state,
                health: state.health - action.damage,
            }

        case PLAYER_DEATH:
            return {
                ...state,
                health: MAX_HEALTH,
                lives:  action.lives,
            }

        case GAME_OVER:
            return {
                ...state,
                lives: 0,
                dead:  true,
            }

        case SCORE_UP:
            return {
                ...state,
                score: state.score + action.points,
            }

        case PLAYER_HEALTH_RESET:
            return {
                ...state,
                health: MAX_HEALTH,
            }

        case PLAYER_LIVES_RESET:
            return {
                ...state,
                lives: MAX_LIVES,
            }

        case SCORE_RESET:
            return {
                ...state,
                score: 0,
            }

        default:
            return state
    }
}
