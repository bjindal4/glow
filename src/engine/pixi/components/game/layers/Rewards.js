import EntityPool from 'core/lib/EntityPool'
import Reward     from '../Reward'

export default class Rewards extends PIXI.particles.ParticleContainer {
    constructor() {
        super(5000, {
            position: true,
            rotation: true,
        })

        this.pool = new EntityPool({
            create: r => {
                const reward = new Reward()
                reward.position.set(r.x, r.y)
                this.addChild(reward)

                return reward
            },
            update: (reward, next) => {
                reward.position.set(next.x, next.y)
                reward.update()
            },
            remove: stale => {
                stale.position.set(-100, -100)
            },
            recycle: (old, reward) => {
                old.id = reward.id
                old.position.set(reward.x, reward.y)
            },
        })
    }

    update(rewards) {
        this.pool.update(rewards)
    }
}