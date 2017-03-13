import Reward       from '../components/game/Reward'
import { makeGrid } from '../lib/arrange'
import {
    resetPlayerHealth,
    resetPlayerLives,
    resetWeapons,
    clearProjectiles,
    resetScore,
    clearBonuses,
    clearEnemies,
    clearEnemiesProjectiles,
} from './index'

export const GAME_START    = 'GAME_START'
export const GAME_PAUSE    = 'GAME_PAUSE'
export const GAME_RESUME   = 'GAME_RESUME'
export const GAME_OVER     = 'GAME_OVER'
export const SPAWN_REWARD  = 'SPAWN_REWARD'
export const REMOVE_REWARD = 'REMOVE_REWARD'
export const SPAWN_POPUP   = 'SPAWN_POPUP'
export const REMOVE_POPUP  = 'REMOVE_POPUP'

export const pause        = () => ({ type: GAME_PAUSE  })
export const resume       = () => ({ type: GAME_RESUME })
export const gameOver     = () => ({ type: GAME_OVER })
export const spawnReward  = item => ({ type: SPAWN_REWARD,  item, layer: 'game.rewards' })
export const removeReward = item => ({ type: REMOVE_REWARD, item, layer: 'game.rewards' })
export const removePopup  = item => ({ type: REMOVE_POPUP, item, layer: 'game.popups' })

export const spawnRewards = (x, y, count) => {
    return dispatch => {
        makeGrid(x, y, count, 36, { spacing: 3 }).forEach(cell => {
            const reward = new Reward()
            reward.position.set(cell.x, cell.y)

            dispatch(spawnReward(reward))
        })
    }
}

export const clearRewards = () => {
    return (dispatch, getState) => {
        const { game: { rewards } } = getState()
        rewards.forEach(reward => {
            dispatch(removeReward(reward))
        })
    }
}

export const spawnPopup = popup => {
    return dispatch => {
        popup.pop(() => dispatch(removePopup(popup)))

        dispatch({ type: SPAWN_POPUP, item: popup, layer: 'game.popups' })
    }
}

export const stopGame = () => {
    return dispatch => {
        dispatch(resetPlayerHealth())
        dispatch(resetPlayerLives())
        dispatch(resetScore())
        dispatch(resetWeapons())
        dispatch(resume())
        dispatch(clearBonuses())
        dispatch(clearEnemies())
        dispatch(clearEnemiesProjectiles())
        dispatch(clearProjectiles())
        dispatch(clearRewards())
    }
}


