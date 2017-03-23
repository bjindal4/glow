import * as d3      from 'd3'
import { identity } from './utils'

export default root => {
    const path = d3.symbol().type(d3.symbolDiamond).size(120)()

    return data => {
        const rewards = root.selectAll('.reward').data(data, identity)

        rewards.enter().append('path')
            .attr('class', 'reward')
            .attr('d', path)
            .attr('fill', '#e7ea3e')
            .merge(rewards)
            .attr('transform', d => `translate(${d.x}, ${d.y})`)

        rewards.exit()
            .remove()
    }
}
