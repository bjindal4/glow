export const BONUS_TYPE_SHOT    = 'BONUS_TYPE_SHOT'
export const BONUS_TYPE_MISSILE = 'BONUS_TYPE_MISSILE'
export const BONUS_TYPE_SHIELD  = 'BONUS_TYPE_SHIELD'
export const BONUS_NIGHT_SHIFT  = 'BONUS_NIGHT_SHIFT'

export default {
    [BONUS_TYPE_SHOT]:    {
        id:    BONUS_TYPE_SHOT,
        img:   'bonusShot',
        label: 'shot level up',
        color: '#9ced45',
    },
    [BONUS_TYPE_MISSILE]: {
        id:    BONUS_TYPE_MISSILE,
        img:   'bonusMissile',
        label: 'missile',
        color: '#e94dc8',
    },
    [BONUS_TYPE_SHIELD]:  {
        id:    BONUS_TYPE_SHIELD,
        img:   'bonusShield',
        label: 'shield',
        color: '#e8cb05',
    },
    [BONUS_NIGHT_SHIFT]:  {
        id:    BONUS_NIGHT_SHIFT,
        img:   'bonusNightShift',
        label: 'night shift',
        color: '#4d9ee9',
    },
}
