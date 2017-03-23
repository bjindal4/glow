import Vector2D                  from 'victor'
import { makeGrid }              from '../lib/arrange'
import { attractor }             from '../lib/forces'
import { rotationFromDirection } from '../lib/orient'
import { increaseScore }         from './index'
import { REWARD_SPEED }          from '../constants'
import {
    rectContains,
    hitTestRectangle,
} from '../lib/collision'

export const SPAWN_REWARD   = 'SPAWN_REWARD'
export const REMOVE_REWARD  = 'REMOVE_REWARD'
export const REWARD_PICKUP  = 'REWARD_PICKUP'
export const REWARDS_UPDATE = 'REWARDS_UPDATE'
export const REWARDS_CLEAR  = 'REWARDS_CLEAR'
export const REWARD_POINTS  = 50

export const spawnReward  = reward => ({ type: SPAWN_REWARD,  reward })
export const removeReward = id     => ({ type: REMOVE_REWARD, id     })

let rewardId = 0

export const spawnRewards = (x, y, count) => (dispatch, getState) => {
    const { game: { direction } } = getState()

    const velocity = new Vector2D(0, REWARD_SPEED)
    velocity.rotate(rotationFromDirection(direction))

    makeGrid(x, y, count, 36, { spacing: 3 }).forEach(cell => {
        dispatch(spawnReward({
            ...cell,
            id:     rewardId++,
            width:  4,
            height: 4,
            vx:     velocity.x,
            vy:     velocity.y,
        }))
    })
}

const attract = attractor({
    distance: 400,
    speed:    18,
})

export const updateRewards = () => {
    return (dispatch, getState) => {
        const {
            game:   { rewards },
            screen: { outerFrame },
            ship,
        } = getState()

        const updatedRewards = []
        rewards.forEach(reward => {
            // remove off-screen rewards
            if (!rectContains(outerFrame, reward)) return

            const { vx, vy } = attract(reward, [ship])

            const updatedReward = {
                ...reward,
                x: reward.x + vx,
                y: reward.y + vy,
                vx, vy,
            }

            if (hitTestRectangle(reward, ship)) {
                dispatch(rewardPickup(reward))
                return
            }

            updatedRewards.push(updatedReward)
        })

        dispatch({ type: REWARDS_UPDATE, rewards: updatedRewards })
    }
}

export const rewardPickup = () => {
    return dispatch => {
        dispatch({ type: REWARD_PICKUP })
        dispatch(increaseScore(REWARD_POINTS))
    }
}

export const clearRewards = () => ({ type: REWARDS_CLEAR })
