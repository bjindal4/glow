import _ from 'lodash'

/**
 * Assumes centered items anchor.
 *
 * @param {number}  x
 * @param {number}  y
 * @param {number}  count
 * @param {number}  size
 * @param {boolean} [center=true]
 * @param {number}  [spacing=0]
 * @return {Array}
 */
export const makeGrid = (x, y, count, size, { center = true, spacing = 0 } = {}) => {
    if (count === 0) return []
    if (count === 1) return [{ x, y }]

    const sqrt           = Math.sqrt(count)
    const columns        = Math.ceil(sqrt)
    const rows           = Math.round(sqrt) < columns ? columns - 1 : columns
    const sizeAndSpacing = size + spacing

    let offsetX   = x
    let offsetY   = y
    if (center === true) {
        offsetX -= (columns - 1) * sizeAndSpacing * .5
        offsetY -= (rows    - 1) * sizeAndSpacing * .5
    }

    let column = 0
    let row    = 0

    return _.range(count).map(() => {
        if (row === rows - 1 && column === 0 && center === true) {
            const modulus = count % columns
            if (modulus > 0) {
                offsetX += (columns - modulus) * sizeAndSpacing * .5
            }

        }
        const pos = {
            x: offsetX + column * sizeAndSpacing,
            y: offsetY + row    * sizeAndSpacing,
        }

        column++
        if (column === columns) {
            column = 0
            row++
        }

        return pos
    })
}