let maxId = 0

export default function renderingMiddleware() {
    return store => next => action => {
        if (action.type.startsWith('SPAWN_')) {
            const { layers } = store.getState()
            action.item.id = maxId
            layers[action.layer].addChild(action.item)
            maxId++
        }

        if (action.type.startsWith('REMOVE_')) {
            const { layers } = store.getState()
            action.item.destroy()
            layers[action.layer].removeChild(action.item)
        }

        return next(action)
    }
}