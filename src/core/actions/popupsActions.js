export const SPAWN_POPUP  = 'SPAWN_POPUP'
export const REMOVE_POPUP = 'REMOVE_POPUP'

let popupId = 0

export const spawnPopup  = popup => ({ type: SPAWN_POPUP,  popup: { ...popup, id: popupId++ } })
export const removePopup = id    => ({ type: REMOVE_POPUP, id    })
