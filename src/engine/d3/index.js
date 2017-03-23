import './styles/HUD.css'
import * as d3                          from 'd3'
import { createStore, applyMiddleware } from 'redux'
import thunk                            from 'redux-thunk'
import reducers                         from 'core/reducers'
import * as actions                     from 'core/actions'
import soundsFXMiddleware               from 'core/middlewares/soundsFXMiddleware'
import { fx as soundsFX }               from '../../resources/sounds'
import setupControls                    from './controls'
import Shots                            from './shots'
import Rewards                          from './rewards'
import Missiles                         from './missiles'
import Asteroids                        from './asteroids'
import Saucers                          from './saucers'
import Popups                           from './popups'
import Bonuses                          from './bonuses'
import hit                              from './fx/hit'
import App                              from 'core/components/App'

const GAME_WIDTH  = window.innerWidth
const GAME_HEIGHT = window.innerHeight

const svg = d3.select('#game').append('svg')
    .attr('width', GAME_WIDTH)
    .attr('height', GAME_HEIGHT)

svg.append('rect')
    .attr('width', GAME_WIDTH)
    .attr('height', GAME_HEIGHT)
    .attr('fill', '#210f1d')

const root = svg.append('g')

svg.append('path')
    .attr('class', 'ship')
    .attr('d', d3.symbol().type(d3.symbolTriangle).size(2400)())
    .attr('fill', '#534544')

const hitMiddleware = store => next => action => {
    if (action.type === actions.ENEMY_HIT) {
        hit(svg, action.enemy.x, action.enemy.y, action.enemy.type === 'saucer' ? '#39f1f6' : '#f6915f')
    }

    return next(action)
}

const store = createStore(reducers, applyMiddleware(
    thunk,
    soundsFXMiddleware(soundsFX),
    hitMiddleware
))

App(store)

setupControls(store)
store.dispatch(actions.setScreenDimensions(GAME_WIDTH, GAME_HEIGHT))
store.dispatch(actions.startGame())

const shots     = Shots(root)
const missiles  = Missiles(root)
const rewards   = Rewards(root)
const asteroids = Asteroids(root, store)
const saucers   = Saucers(root, store)
const popups    = Popups(root, store)
const bonuses   = Bonuses(root, store)

const tick = () => {
    requestAnimationFrame(tick)

    store.dispatch(actions.gameTick())

    const state = store.getState()

    if (state.game.isPaused) return

    svg.select('.ship')
        .attr('transform', `translate(${state.ship.x}, ${state.ship.y})`)

    bonuses(state.bonuses.items)
    rewards(state.game.rewards)
    shots(state.weapons.shots.projectiles)
    missiles(state.weapons.missiles.projectiles)
    //popups(state.game.popups)
    saucers(state.enemies.items.filter(i => i.type === 'saucer'))
    asteroids(state.enemies.items.filter(i => i.type === 'asteroid'))
}

tick()

