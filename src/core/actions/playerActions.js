import _            from 'lodash'
import { gameOver } from './gameActions'
import {
    resetWeapons,
    spawnBonus,
} from './index'
import {
    BONUS_TYPE_SHOT,
    BONUS_TYPE_MISSILE,
} from '../../config'

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

export const playerDeath = lives => (dispatch, getState) => {
    const {
        screen:  { width, height },
        weapons: { shots, missiles },
    } = getState()

    dispatch(resetWeapons())
    dispatch({ type: PLAYER_DEATH, lives })

    // respawn lost weapons bonuses
    _.range(shots.level - 1).forEach(() => {
        dispatch(spawnBonus({
            type: BONUS_TYPE_SHOT,
            x: width  * .5 + Math.random() * 120 - 60,
            y: height * .5 + Math.random() * 120 - 60
        }))
    })
    _.range(missiles.level).forEach(() => {
        dispatch(spawnBonus({
            type: BONUS_TYPE_MISSILE,
            x: width  * .5 + Math.random() * 120 - 60,
            y: height * .5 + Math.random() * 120 - 60
        }))
    })
}

