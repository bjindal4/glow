import Vector2D              from 'victor'
import { SHOT_TYPE_HEXAGON } from '../weapons/shots'

export default {
    type:           'asteroid',
    spawnInterval:  100,
    speed:          2,
    item:           {
        health:       40,
        damage:       20,
        points:       200,
        rewardsCount: 5,
        hitRect: {
            x:      -26,
            y:      -26,
            width:   52,
            height:  52,
        },
    },
    firingInterval: 20,
    orientShots:    false,
    salvo:          ({ x, y, age }) => {
        const velocity = new Vector2D(0, 3).rotateBy(age * .05)

        return [{
            type: SHOT_TYPE_HEXAGON,
            x, y,
            vx: velocity.x,
            vy: velocity.y,
        }]
    }
}
