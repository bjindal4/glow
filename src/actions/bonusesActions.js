import sounds from '../sounds'
import {
    BONUS_TYPE_SHOT,
    BONUS_TYPE_MISSILE,
    BONUS_TYPE_SHIELD,
} from '../components/game/Bonus'
import {
    increaseShotLevel,
    increaseMissilesLevel,
    enableShield,
} from './weaponsActions'

export const SPAWN_BONUS  = 'SPAWN_BONUS'
export const REMOVE_BONUS = 'REMOVE_BONUS'

export const spawnBonus  = item => ({ type: SPAWN_BONUS,  item, layer: 'game.bonuses' })
export const removeBonus = item => ({ type: REMOVE_BONUS, item, layer: 'game.bonuses' })

export const clearBonuses = () => {
    return (dispatch, getState) => {
        const { bonuses: { items } } = getState()
        items.forEach(item => {
            dispatch(removeBonus(item))
        })
    }
}

export const bonusPickup = bonus => {
    sounds.bonus.play()
    bonus.pickedUp()

    return dispatch => {
        switch (bonus.type.id) {
            case BONUS_TYPE_SHOT:
                sounds.powerUp.play()
                dispatch(increaseShotLevel())
                break

            case BONUS_TYPE_MISSILE:
                sounds.powerUp.play()
                dispatch(increaseMissilesLevel())
                break

            case BONUS_TYPE_SHIELD:
                sounds.powerUp.play()
                dispatch(enableShield())
                break
        }
    }
}