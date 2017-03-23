import { identity, degrees } from './utils'

export default root => data => {
    const missiles = root.selectAll('.missile').data(data, identity)

    missiles.enter().append('rect')
        .attr('class', 'missile')
        .attr('width', 6)
        .attr('height', 18)
        .attr('fill', '#e94dc8')
    .merge(missiles)
        .attr('transform', d => `translate(${d.x}, ${d.y}) rotate(${degrees(d.rotation)})`)

    missiles.exit()
        .remove()
}
