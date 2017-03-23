export const SETTING_SET = 'SETTING_SET'

export const setSetting = (key, value) => ({
    type: SETTING_SET,
    key,
    value,
})
