export default function soundsFXMiddleware(sounds) {
    return store => next => action => {
        if (sounds[action.type]) {
            sounds[action.type]()
        }

        return next(action)
    }
}