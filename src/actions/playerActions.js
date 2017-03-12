import sounds           from '../sounds'
import { gameOver }     from './gameActions'
import { resetWeapons } from './weaponsActions'

export const SHIP_HIT            = 'SHIP_HIT'
export const MAX_HEALTH          = 200
export const PLAYER_DEATH        = 'PLAYER_DEATH'
export const PLAYER_LIVES_RESET  = 'PLAYER_LIVES_RESET'
export const PLAYER_HEALTH_RESET = 'PLAYER_HEALTH_RESET'
export const SCORE_UP            = 'SCORE_UP'
export const SCORE_RESET         = 'SCORE_RESET'

export const increaseScore     = points => ({ type: SCORE_UP, points })
export const resetScore        = () => ({ type: SCORE_RESET })
export const resetPlayerHealth = () => ({ type: PLAYER_HEALTH_RESET })
export const resetPlayerLives  = () => ({ type: PLAYER_LIVES_RESET })

export const shipHit = damage => {
    return (dispatch, getState) => {
        sounds.shipHit.play()

        const { player: { health, lives } } = getState()
        dispatch({ type: SHIP_HIT, damage })

        if (health - damage < 0) {
            if (lives > 0) {
                dispatch(playerDeath(lives - 1))
            } else {
                dispatch(gameOver())
            }
            return true
        }

        return false
    }
}

export const playerDeath = lives => {
    sounds.playerDeath.play()

    return dispatch => {
        dispatch(resetWeapons())
        dispatch({ type: PLAYER_DEATH, lives })
    }
}

