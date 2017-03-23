import _               from 'lodash'
import * as directions from '../constants/gameDirections'
import {
    resetPlayerHealth,
    resetPlayerLives,
    resetWeapons,
    clearProjectiles,
    resetScore,
    updateBonuses,
    clearBonuses,
    clearEnemies,
    clearEnemiesProjectiles,
    updateShip,
    fireIfNeeded,
    shouldSpawnBonus,
    shouldSpawnEnemy,
    updateEnemies,
    clearRewards,
    updateRewards,
    updateEnemiesProjectiles,
    moveShipToInitialPosition,
} from './index'

export const GAME_START         = 'GAME_START'
export const GAME_PAUSE         = 'GAME_PAUSE'
export const GAME_RESUME        = 'GAME_RESUME'
export const GAME_OVER          = 'GAME_OVER'
export const GAME_STOP          = 'GAME_STOP'
export const GAME_TICK          = 'GAME_TICK'
export const GAME_DIRECTION_SET = 'GAME_DIRECTION_SET'

export const setGameDirection = direction => ({ type: GAME_DIRECTION_SET, direction })

export const switchGameDirection = () => (dispatch, getState) => {
    const { game: { direction } } = getState()
    const directionIndex = _.findIndex(directions.GAME_DIRECTIONS, d => d === direction)

    let nextDirection
    if (directionIndex > directions.GAME_DIRECTIONS.length - 2) {
        nextDirection = directions.GAME_DIRECTIONS[0]
    } else {
        nextDirection = directions.GAME_DIRECTIONS[directionIndex + 1]
    }

    dispatch(setGameDirection(nextDirection))
}

export const gameTick = () => (dispatch, getState) => {
    const { game: { isPaused } } = getState()
    if (!isPaused) {
        dispatch({ type: GAME_TICK })
        dispatch(updateShip())
        dispatch(fireIfNeeded())
        dispatch(shouldSpawnBonus())
        dispatch(updateBonuses())
        dispatch(shouldSpawnEnemy())
        dispatch(updateEnemies())
        dispatch(updateEnemiesProjectiles())
        dispatch(updateRewards())
        dispatch(updateNightShift())
    }
}

export const startGame = () => dispatch => {
    dispatch(moveShipToInitialPosition())
    dispatch({ type: GAME_START })
}

export const gameOver = () => ({ type: GAME_OVER })
export const pause    = () => ({ type: GAME_PAUSE  })
export const resume   = () => ({ type: GAME_RESUME  })

export const continueGame = () => {
    return dispatch => {
        dispatch(resetPlayerHealth())
        dispatch(resetPlayerLives())
        dispatch(startGame())
    }
}

export const stopGame = () => dispatch => {
    dispatch(resetPlayerHealth())
    dispatch(resetPlayerLives())
    dispatch(resetScore())
    dispatch(resetWeapons())
    dispatch(clearBonuses())
    dispatch(clearEnemies())
    dispatch(clearEnemiesProjectiles())
    dispatch(clearProjectiles())
    dispatch(clearRewards())
    dispatch({ type: GAME_STOP })
}

export const NIGHT_SHIFT_ENABLE  = 'NIGHT_SHIFT_ENABLE'
export const NIGHT_SHIFT_DISABLE = 'NIGHT_SHIFT_DISABLE'
export const NIGHT_SHIFT_UPDATE  = 'NIGHT_SHIFT_UPDATE'

export const enableNightShift  = () => ({ type: NIGHT_SHIFT_ENABLE  })
export const disableNightShift = () => ({ type: NIGHT_SHIFT_DISABLE })
export const updateNightShift  = () => {
    return (dispatch, getState) => {
        const { game: { nightShift } } = getState()
        if (!nightShift.isEnabled) return

        if (nightShift.remainingTime === 0) {
            dispatch(disableNightShift())
            return
        }

        dispatch({ type: NIGHT_SHIFT_UPDATE })
    }
}

export const MOVE_CONTROL_ENABLE  = 'MOVE_CONTROL_ENABLE'
export const MOVE_CONTROL_DISABLE = 'MOVE_CONTROL_DISABLE'

export const enableMoveControl  = controlType => ({ type: MOVE_CONTROL_ENABLE,  controlType })
export const disableMoveControl = controlType => ({ type: MOVE_CONTROL_DISABLE, controlType })
