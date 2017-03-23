import Keyboard     from 'keyboardjs'
import * as actions from 'core/actions'

export default store => {
    const dirs = ['up', 'right', 'down', 'left']
    dirs.forEach(direction => {
        Keyboard.bind(direction, e => {
            e.preventRepeat()
            store.dispatch(actions.enableMoveControl(direction))
        }, () => {
            store.dispatch(actions.disableMoveControl(direction))
        })
    })
    Keyboard.bind('space', () => {
        const { weapons: { isFiring } } = store.getState()
        if (!isFiring) store.dispatch(actions.enableFiring())
    }, () => {
        store.dispatch(actions.disableFiring())
    })
    Keyboard.bind('f', () => {}, () => {
        const { weapons: { isFiring } } = store.getState()
        if (!isFiring) return store.dispatch(actions.enableFiring())
        store.dispatch(actions.disableFiring())
    })
    Keyboard.bind('p', () => {}, () => {
        const { game: { isPaused } } = store.getState()
        if (isPaused) return store.dispatch(actions.resume())
        store.dispatch(actions.pause())
    })
    Keyboard.bind('x', () => {}, () => {
        store.dispatch(actions.switchGameDirection())
    })
    Keyboard.bind('m', () => {}, () => {
        store.dispatch(actions.increaseMissilesLevel())
    })
    Keyboard.bind('s', () => {}, () => {
        store.dispatch(actions.increaseShotLevel())
    })
    Keyboard.bind('w', () => {}, () => {
        store.dispatch(actions.resetWeapons())
    })
    Keyboard.bind('n', () => {}, () => {
        const { game: { nightShift: { isEnabled } } } = store.getState()
        if (isEnabled) return store.dispatch(actions.disableNightShift())
        store.dispatch(actions.enableNightShift())
    })
}