import * as d3         from 'd3'
import { removeBonus } from 'core/actions'
import { identity }    from './utils'
import config          from '../../config'

export default (root, store) => {
    const rm = ({ id }) => store.dispatch(removeBonus(id))

    return data => {
        const bonuses = root.selectAll('.bonus').data(data, identity)

    bonuses.enter().append('g')
        .attr('class', 'bonus')
        .each(function (d) {
            const type = config.bonuses[d.type]
            const el   = d3.select(this)

            el.append('circle')
                .attr('r', 16)
                .attr('fill', 'none')
                .attr('stroke', type.color)
                .attr('stroke-width', 3)

            el.append('text')
                .attr('text-anchor', 'middle')
                .attr('fill', type.color)
                .attr('dy', 5)
                .style('font-size', 16)
                .style('font-weight', 'bold')
                .text(type.label.substr(0, 1).toUpperCase())
        })
    .merge(bonuses.filter(d => !d.pickedUp))
        .attr('transform', d => `translate(${d.x}, ${d.y})`)

    bonuses.filter(d => d.pickedUp)
        .each(rm)

    bonuses.exit()
        .remove()
    }
}
