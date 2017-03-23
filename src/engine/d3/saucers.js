import { removeEnemy } from 'core/actions'
import { identity }    from './utils'

export default (root, store) => {
    const rm = ({ id }) => store.dispatch(removeEnemy(id))

    return data => {
        const saucers = root.selectAll('.saucer').data(data, identity)

        saucers.enter().append('circle')
            .attr('class', 'saucer')
            .attr('stroke', '#39f1f6')
            .attr('fill', 'none')
            .attr('stroke-width', 6)
            .attr('r', 20)
        .merge(saucers)
            .attr('transform', d => `translate(${d.x}, ${d.y})`)

        saucers.filter(d => d.health <= 0)
            .each(rm)

        saucers.exit()
            .remove()
    }
}
