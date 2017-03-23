import 'pixi.js'
import TWEEN                                   from 'tween.js'
import { Howler }                              from 'howler'
import { createStore, applyMiddleware }        from 'redux'
import thunk                                   from 'redux-thunk'
import { gameStats }                           from 'core/lib/debug'
import soundsFXMiddleware                      from 'core/middlewares/soundsFXMiddleware'
import reducers                                from 'core/reducers'
import * as actions                            from 'core/actions'
import { fx as soundsFX }                      from '../../resources/sounds'
import resources                               from './resources'
import { Home, Settings, Help, Credits, Game } from './scenes'

const store = createStore(reducers, applyMiddleware(thunk, soundsFXMiddleware(soundsFX)))

window.gameState = () => store.getState()
window.gameStats = () => console.table(gameStats(store.getState()))

let {
    innerWidth:  screenWidth,
    innerHeight: screenHeight,
} = window

screenWidth  = 1080
screenHeight = 760

store.dispatch(actions.setScreenDimensions(screenWidth, screenHeight))

const renderer = new PIXI.WebGLRenderer(screenWidth, screenHeight, { resolution: 1 })
renderer.autoResize      = true
renderer.backgroundColor = 0x1d0c1e
renderer.resize(screenWidth, screenHeight)
document.getElementById('game').appendChild(renderer.view)

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

    const copyright = new PIXI.Text(`© Raphaël Benitte - 2017`, {
        fontFamily: 'Arial',
        fontSize:   14,
        fill:       '#9c4b99',
        align:      'right',
    })
    copyright.x = screenWidth - 20 - copyright.width
    copyright.y = screenHeight - 36
    stage.addChild(copyright)

    tick()
}

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
