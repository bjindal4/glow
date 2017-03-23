import Asteroid from './Asteroid'
import Saucer   from './Saucer'

export { default as Asteroid } from './Asteroid'
export { default as Saucer }   from './Saucer'

export const poolByEnemyType = {
    [Asteroid.TYPE]: Asteroid.getPool,
    [Saucer.TYPE]:   Saucer.getPool,
}
