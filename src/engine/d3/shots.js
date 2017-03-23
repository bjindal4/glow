import { identity } from './utils'

export default root => data => {
    const shots = root.selectAll('.shot').data(data, identity)

    shots.enter().append('circle')
        .attr('class', 'shot')
        .attr('r', 3)
        .attr('fill', '#9ced45')
    .merge(shots)
        .attr('transform', d => `translate(${d.x}, ${d.y})`)

    shots.exit()
        .remove()
}
