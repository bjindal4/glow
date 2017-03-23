import { shouldFireShot, updateShots }       from './shotsActions'
import { shouldFireMissile, updateMissiles } from './missilesActions'

export * from './shotsActions'
export * from './missilesActions'

export const SHIELD_TTL                = 6000
export const FIRING_ON                 = 'FIRING_ON'
export const FIRING_OFF                = 'FIRING_OFF'
export const WEAPONS_SHIELD_ON         = 'WEAPONS_SHIELD_ON'
export const WEAPONS_SHIELD_OFF        = 'WEAPONS_SHIELD_OFF'
export const WEAPONS_RESET             = 'WEAPONS_RESET'
export const WEAPONS_PROJECTILES_CLEAR = 'WEAPONS_PROJECTILES_CLEAR'

export const enableFiring     = () => ({ type: FIRING_ON  })
export const disableFiring    = () => ({ type: FIRING_OFF })
export const disableShield    = () => ({ type: WEAPONS_SHIELD_OFF })
export const resetWeapons     = () => ({ type: WEAPONS_RESET })
export const clearProjectiles = () => ({ type: WEAPONS_PROJECTILES_CLEAR })

export const fireIfNeeded = () => {
    return (dispatch, getState) => {
        const {
            game:    { isPaused },
            weapons: { isFiring },
        } = getState()

        if (isPaused) return

        if (isFiring === true) {
            dispatch(shouldFireShot())
            dispatch(shouldFireMissile())
        }

        dispatch(updateShots())
        dispatch(updateMissiles())
    }
}

let shieldTimer

export const enableShield = () => {
    return dispatch => {
        if (shieldTimer) clearTimeout(shieldTimer)

        dispatch({ type: WEAPONS_SHIELD_ON })
        shieldTimer = setTimeout(() => {
            dispatch(disableShield())
        }, SHIELD_TTL)
    }
}


