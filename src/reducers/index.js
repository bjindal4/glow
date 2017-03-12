import { combineReducers } from 'redux'
import bonuses             from './bonusesReducer'
import enemies             from './enemiesReducer'
import game                from './gameReducer'
import layers              from './layersReducer'
import player              from './playerReducer'
import scenes              from './scenesReducer'
import screen              from './screenReducer'
import settings            from './settingsReducer'
import weapons             from './weaponsReducer'

export default combineReducers({
    bonuses,
    enemies,
    game,
    layers,
    player,
    scenes,
    screen,
    settings,
    weapons,
})
