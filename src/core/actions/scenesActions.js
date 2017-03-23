import _ from 'lodash'

export const SET_SCENES        = 'SET_SCENES'
export const ADD_SCENE         = 'ADD_SCENE'
export const SET_CURRENT_SCENE = 'SET_CURRENT_SCENE'

export const setScenes = scenes => ({ type: SET_SCENES, scenes })
export const addScene  = scene  => ({ type: ADD_SCENE,  scene  })

export const setCurrentScene = id => {
    return (dispatch, getState) => {
        const { scenes: { items, current } } = getState()
        if (current === id) return

        if (current !== null) {
            const previousScene = _.find(items, { id: current })
            previousScene.willLeave()
        }

        const nextScene = _.find(items, { id })
        nextScene.willEnter()

        dispatch({ type: SET_CURRENT_SCENE, id })
    }
}
