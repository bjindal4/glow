import './styles/three.css'
import TWEEN                            from 'tween.js'
import { Howler }                       from 'howler'
import { createStore, applyMiddleware } from 'redux'
import thunk                            from 'redux-thunk'
import Stats                            from 'stats.js'
import reducers                         from 'core/reducers'
import * as actions                     from 'core/actions'
import { gameStats }                    from 'core/lib/debug'
import soundsFXMiddleware               from 'core/middlewares/soundsFXMiddleware'
import { fx as soundsFX }               from '../../resources/sounds'
import Lights                           from './components/environment/Lights'
import Arena                            from './components/environment/Arena'
import Ship                             from './components/Ship'
import Shots                            from './components/Shots'
import Bonus                            from './components/Bonus'
import Missiles                         from './components/Missiles'
import Rewards                          from './components/Rewards'
import Enemies                          from './Enemies'
import EnemyWeapon                      from './EnemyWeapon'
import Popup                            from './components/Popup'
import setupControls                    from './controls'
import settings                         from './settings'
import App                              from 'core/components/App'
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    PCFSoftShadowMap,
    Fog,
} from 'three'

Howler.mute(false)

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type    = PCFSoftShadowMap
renderer.antialias         = settings.antialiasing
renderer.setPixelRatio(settings.pixelRatio)
renderer.setClearColor(settings.fogColor, 1)

const fpsStats = new Stats()
fpsStats.showPanel(0)

document.getElementById('game').appendChild(renderer.domElement)
document.getElementById('game').appendChild(fpsStats.dom)

const scene  = new Scene()
const camera = new PerspectiveCamera(settings.camera.fov,  window.innerWidth / window.innerHeight, 1, 2000)
const ship   = new Ship()
const arena  = new Arena(settings.arenaWidth, settings.arenaHeight)
const lights = new Lights(scene)

scene.fog = new Fog(settings.fogColor, 1000, 2200)

scene.add(arena)
scene.add(camera)
scene.add(ship)

const store = createStore(reducers, applyMiddleware(thunk, soundsFXMiddleware(soundsFX)))

window.gameState = () => store.getState()
window.gameStats = () => console.table(gameStats(store.getState()))

App(store)

setupControls(store)
store.dispatch(actions.setScreenDimensions(settings.arenaWidth, settings.arenaHeight))
store.dispatch(actions.startGame())

const bonuses        = Bonus(scene, store)
const missiles       = Missiles(scene, store)
const shots          = Shots(scene, store)
const rewards        = Rewards(scene, store)
const enemies        = new Enemies(scene, store)
const enemiesWeapons = EnemyWeapon(scene, store)
const popups         = Popup.pool(scene, store)

const cameraSetup = settings.camera.top
camera.position.x = cameraSetup.x
camera.position.y = cameraSetup.y
camera.position.z = cameraSetup.z

// uncomment to pause on startup
store.dispatch(actions.pause())

const render = () => {
    requestAnimationFrame(render)

    store.dispatch(actions.gameTick())

    const state = store.getState()

    const { screen: { width, height } } = state

    // Translates 2D coordinates to 3D
    // and returns rotation according to tube shape
    const transpose = ({ x, y }) => {
        const ratio = (x - width * .5) / width * .5
        const angle = ratio * settings.tubeAngle * 2 - Math.PI * .5

        return {
            x:       Math.cos(angle) * (settings.tubeRadius - settings.groundOffset),
            y:       settings.tubeRadius + Math.sin(angle) * (settings.tubeRadius - settings.groundOffset),
            z:       y - height * .5,
            rotateZ: angle + Math.PI * .5,
        }
    }

    camera.lookAt(scene.position)
    if (settings.influenceCamera) {
        camera.position.x = (state.ship.x - width * .5) * .2
        camera.position.z = (state.ship.y - width * .5) * .3 + cameraSetup.z
    }

    const {
        x: shipX,
        y: shipY,
        z: shipZ,
        rotateZ: shipZrot,
    } = transpose(state.ship)
    ship.position.set(shipX, shipY, shipZ)
    ship.rotation.z = shipZrot + state.ship.vx * -.05
    ship.rotation.x = state.ship.vy * .05

    arena.direction     = state.game.direction
    ship.direction      = state.game.direction
    lights.direction    = state.game.direction
    lights.shipPosition = ship.position
    lights.nightShift   = state.game.nightShift.isEnabled

    if (!state.game.isPaused) {
        arena.update()
        bonuses.update(state.bonuses.items, transpose)
        missiles.update(state.weapons.missiles.projectiles, transpose)
        shots.update(state.weapons.shots.projectiles, transpose)
        rewards.update(state.game.rewards, transpose)
        enemies.update(state.enemies.items, transpose)
        enemiesWeapons.update(state.enemies.projectiles, transpose)
        popups.update(state.game.popups)
    }

    renderer.render(scene, camera)

    TWEEN.update()
    fpsStats.update()
}
render()

