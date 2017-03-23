import * as d3         from 'd3'
import { removeEnemy } from 'core/actions'
import { identity }    from './utils'

export default (root, store) => {
    const path = d3.symbol().type(d3.symbolWye).size(1600)()

    const rm = ({ id }) => store.dispatch(removeEnemy(id))

    return data => {
        const asteroids = root.selectAll('.asteroid').data(data, identity)

        asteroids.enter().append('path')
            .attr('class', 'asteroid')
            .attr('fill', '#f6915f')
            .attr('d', path)
        .merge(asteroids)
            .attr('transform', d => `translate(${d.x}, ${d.y}) rotate(${d.age * 2})`)

        asteroids.filter(d => d.health <= 0)
            .each(rm)

        asteroids.exit()
            .remove()
    }
}
