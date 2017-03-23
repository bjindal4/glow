import {
    rectContains,
    hitTestRectangle,
} from '../lib/collision'
import config, {
    BONUS_TYPE_SHOT,
    BONUS_TYPE_MISSILE,
    BONUS_TYPE_SHIELD,
    BONUS_NIGHT_SHIFT,
} from '../../config'
import {
    increaseShotLevel,
    increaseMissilesLevel,
    enableShield,
    spawnPopup,
    enableNightShift,
} from './index'
import {
    GAME_DIRECTION_UPWARD,
    GAME_DIRECTION_FORWARD,
    GAME_DIRECTION_DOWNWARD,
    GAME_DIRECTION_BACKWARD,
} from '../constants'

const BONUS_SPAWN_INTERVAL = 200
const BONUS_SPEED          = 3
const BONUS_HIT_RECT       = {
    x:      -18,
    y:      -18,
    width:   36,
    height:  36,
}

export const SPAWN_BONUS    = 'SPAWN_BONUS'
export const REMOVE_BONUS   = 'REMOVE_BONUS'
export const BONUSES_UPDATE = 'BONUSES_UPDATE'
export const BONUSES_CLEAR  = 'BONUSES_CLEAR'
export const BONUS_PICKUP   = 'BONUS_PICKUP'

export const removeBonus = id => ({ type: REMOVE_BONUS, id    })

const velocityByDirection = {
    [GAME_DIRECTION_UPWARD]:   { vx: 0,            vy: BONUS_SPEED  },
    [GAME_DIRECTION_FORWARD]:  { vx: -BONUS_SPEED, vy: 0            },
    [GAME_DIRECTION_DOWNWARD]: { vx: 0,            vy: -BONUS_SPEED },
    [GAME_DIRECTION_BACKWARD]: { vx: BONUS_SPEED,  vy: 0            },
}

let bonusId = 0

export const spawnBonus = bonus => {
    return (dispatch, getState) => {
        const { game: { direction } } = getState()

        dispatch({
            type:  SPAWN_BONUS,
            bonus: {
                pickedUp: false,
                id:       bonusId++,
                hitRect:  { ...BONUS_HIT_RECT },
                ...bonus,
                ...velocityByDirection[direction],
            },
        })
    }
}

export const shouldSpawnBonus = () => {
    return (dispatch, getState) => {
        const {
            game:   { time, direction },
            screen: { width, height },
        } = getState()

        if (time % BONUS_SPAWN_INTERVAL === 0) {
            const seed = Math.random()

            let type
            if (seed < .25)      type = BONUS_TYPE_SHOT
            else if (seed < .5)  type = BONUS_TYPE_MISSILE
            else if (seed < .75) type = BONUS_NIGHT_SHIFT
            else                 type = BONUS_TYPE_SHIELD

            let position
            switch (direction) {
                case GAME_DIRECTION_UPWARD:
                    position = { x: Math.random() * width, y: -40 }
                    break
                case GAME_DIRECTION_FORWARD:
                    position = { x: width + 40, y: Math.random() * height }
                    break
                case GAME_DIRECTION_DOWNWARD:
                    position = { x: Math.random() * width, y: height + 40  }
                    break
                case GAME_DIRECTION_BACKWARD:
                    position = { x: -40, y: Math.random() * height }
                    break
            }

            const bonus = { type, ...position }

            dispatch(spawnBonus(bonus))
        }
    }
}

export const bonusPickup = ({ type, x, y }) => dispatch => {
    const bonusConfig = config.bonuses[type]

    dispatch({ type: BONUS_PICKUP })

    dispatch(spawnPopup({
        x, y,
        text:  bonusConfig.label,
        color: bonusConfig.color,
    }))

    switch (type) {
        case BONUS_TYPE_SHOT:
            dispatch(increaseShotLevel())
            break

        case BONUS_TYPE_MISSILE:
            dispatch(increaseMissilesLevel())
            break

        case BONUS_TYPE_SHIELD:
            dispatch(enableShield())
            break

        case BONUS_NIGHT_SHIFT:
            dispatch(enableNightShift())
            break
    }
}

export const updateBonuses = () => {
    return (dispatch, getState) => {
        const {
            bonuses: { items: bonuses },
            screen:  { outerFrame },
            ship,
        } = getState()

        const updatedBonuses = []
        bonuses.forEach(bonus => {
            const updatedBonus = {
                ...bonus,
                x: bonus.x + bonus.vx,
                y: bonus.y + bonus.vy,
            }

            // remove off-screen bonuses
            if (!rectContains(outerFrame, updatedBonus)) return

            if (!updatedBonus.pickedUp && hitTestRectangle(ship, updatedBonus)) {
                updatedBonus.pickedUp = true
                updatedBonus.vx       = 0
                updatedBonus.vy       = 0
                dispatch(bonusPickup(updatedBonus))
            }

            updatedBonuses.push(updatedBonus)
        })

        dispatch({ type: BONUSES_UPDATE, bonuses: updatedBonuses })
    }
}

export const clearBonuses = () => ({ type: BONUSES_CLEAR })