import { SHOT_TYPE_SQUARE } from '../weapons/shots'

export default {
    type:           'saucer',
    spawnInterval:  50,
    speed:          4,
    item:           {
        health:       20,
        damage:       10,
        points:       100,
        rewardsCount: 3,
        hitRect: {
            x:      -20,
            y:      -20,
            width:   40,
            height:  40,
        },
    },
    firingInterval: 40,
    orientShots:    true,
    salvo:          ({ x, y }) => ([{
        type: SHOT_TYPE_SQUARE,
        x, y,
        vx: 0,
        vy: 6,
    }]),
}
