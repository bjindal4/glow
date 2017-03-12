import 'pixi.js'
import TWEEN                                   from 'tween.js'
import { Howler }                              from 'howler'
import { createStore, applyMiddleware }        from 'redux'
import thunk                                   from 'redux-thunk'
import resources                               from './resources'
import reducers                                from './reducers'
import renderingMiddleware                     from './middlewares/renderingMiddleware'
import { Home, Settings, Help, Credits, Game } from './scenes'
import * as actions                            from './actions'

const store = createStore(reducers, applyMiddleware(thunk, renderingMiddleware()))

const {
    innerWidth:  screenWidth,
    innerHeight: screenHeight,
} = window

store.dispatch(actions.setScreenDimensions(screenWidth, screenHeight))

const renderer = new PIXI.WebGLRenderer(screenWidth, screenHeight, { resolution: 1 })
renderer.view.style.position = 'absolute'
renderer.view.style.display  = 'block'
renderer.autoResize          = true
renderer.backgroundColor     = 0x1d0c1e
document.body.appendChild(renderer.view)

Howler.mute(false)

const stage = new PIXI.Container()

const setup = () => {
    const scenes = [Home, Game, Settings, Help, Credits].map(sceneClass => {
        const scene = new sceneClass(store)
        stage.addChild(scene)

        return scene
    })

    store.dispatch(actions.setScenes(scenes))
    store.dispatch(actions.setCurrentScene('home'))

    tick()
}

window.dumpState = () => store.getState()

let time   = 0
const tick = () => {
    requestAnimationFrame(tick)

    const { scenes } = store.getState()
    scenes.items.forEach(scene => scene.tick(time))

    TWEEN.update()
    renderer.render(stage)
    time++
}

resources().load(setup)
