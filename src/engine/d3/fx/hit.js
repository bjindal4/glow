import _        from 'lodash'
import Vector2D from 'victor'

const linesCount = 5
const length     = 10
const radius     = 32
const angle      = Math.PI * 2 / linesCount
const vectors    = _.range(linesCount).map(i => {
    const v1 = new Vector2D(0, radius)
    const v2 = new Vector2D(0, radius + length)

    v1.rotate(i * angle)
    v2.rotate(i * angle)

    return {
        x1: v1.x, y1: v1.y,
        x2: v2.x, y2: v2.y,
    }
})

export default (root, x, y, color = '#fff') => {
    const anchor = root.append('g')
        .attr('class', 'hit')
        .attr('transform', `translate(${x}, ${y}) rotate(${Math.random() * 360})`)

    anchor.selectAll('line').data(vectors)
        .enter()
        .append('line')
        .attr('stroke', color)
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('x1', d => d.x1 * .1)
        .attr('y1', d => d.y1 * .1)
        .attr('x2', d => d.x2 * .1)
        .attr('y2', d => d.y2 * .1)
    .transition()
        .duration(200)
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
    .transition()
        .duration(160)
        .attr('x1', d => d.x2)
        .attr('y1', d => d.y2)
    .on('end', () => {
        anchor.remove()
    })
}
