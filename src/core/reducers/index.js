import { combineReducers } from 'redux'
import bonuses             from './bonusesReducer'
import enemies             from './enemiesReducer'
import game                from './gameReducer'
import player              from './playerReducer'
import scenes              from './scenesReducer'
import screen              from './screenReducer'
import settings            from './settingsReducer'
import ship                from './shipReducer'
import weapons             from './weapons'

export default combineReducers({
    bonuses,
    enemies,
    game,
    player,
    scenes,
    screen,
    settings,
    ship,
    weapons,
})
