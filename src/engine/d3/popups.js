import { removePopup } from 'core/actions'
import { identity }    from './utils'

export default (root, store) => {
    const rm = ({ id }) => store.dispatch(removePopup(id))

    return data => {
        const popups = root.selectAll('.popup').data(data, identity)

        popups.enter().append('text')
            .attr('class', 'popup')
            .attr('fill', d => d.color)
            .text(d => d.text)
        .merge(popups)
            .attr('transform', d => `translate(${d.x}, ${d.y})`)

        popups.exit()
            .remove()
    }
}
