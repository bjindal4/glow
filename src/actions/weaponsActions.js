import { MAX_SHOT_LEVEL, MAX_MISSILES_LEVEL } from '../components/game/weapons'

export const SHIELD_TTL          = 6000
export const FIRING_ON           = 'FIRING_ON'
export const FIRING_OFF          = 'FIRING_OFF'
export const WEAPONS_SHOT_UP     = 'WEAPONS_SHOT_UP'
export const WEAPONS_MISSILES_UP = 'WEAPONS_MISSILES_UP'
export const WEAPONS_SHIELD_ON   = 'WEAPONS_SHIELD_ON'
export const WEAPONS_SHIELD_OFF  = 'WEAPONS_SHIELD_OFF'
export const WEAPONS_RESET       = 'WEAPONS_RESET'
export const SPAWN_PROJECTILE    = 'SPAWN_PROJECTILE'
export const REMOVE_PROJECTILE   = 'REMOVE_PROJECTILE'

export const enableFiring     = () => ({ type: FIRING_ON  })
export const disableFiring    = () => ({ type: FIRING_OFF })
export const spawnProjectile  = item => ({ type: SPAWN_PROJECTILE,  item, layer: 'game.main' })
export const removeProjectile = item => ({ type: REMOVE_PROJECTILE, item, layer: 'game.main' })
export const disableShield    = () => ({ type: WEAPONS_SHIELD_OFF })
export const resetWeapons     = () => ({ type: WEAPONS_RESET })

export const increaseShotLevel = () => {
    return (dispatch, getState) => {
        const { weapons: { shot: { level } } } = getState()
        if (level < MAX_SHOT_LEVEL) {
            dispatch({ type: WEAPONS_SHOT_UP })
        }
    }
}

export const increaseMissilesLevel = () => {
    return (dispatch, getState) => {
        const { weapons: { missiles: { level } } } = getState()
        if (level < MAX_MISSILES_LEVEL) {
            dispatch({ type: WEAPONS_MISSILES_UP })
        }
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

export const clearProjectiles = () => {
    return (dispatch, getState) => {
        const { weapons: { projectiles } } = getState()
        projectiles.forEach(projectile => {
            dispatch(removeProjectile(projectile))
        })
    }
}
