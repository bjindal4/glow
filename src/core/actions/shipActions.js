import { positionRectConstrain } from '../lib/collision'

export const SHIP_SPEED                = 12
export const SHIP_VELOCITY_INERTIA     = .91
export const SHIP_VELOCITY_STEP        = 2
export const SHIP_VELOCITY_UPDATE      = 'SHIP_VELOCITY_UPDATE'
export const SHIP_POSITION_UPDATE      = 'SHIP_POSITION_UPDATE'

export const updateShipVelocity = (component, value) => ({
    type: SHIP_VELOCITY_UPDATE,
    component,
    value,
})

export const updateShipPosition = (x, y)  => ({ type: SHIP_POSITION_UPDATE, x,  y })

export const moveShipToInitialPosition = () => {
    return (dispatch, getState) => {
        const {
            screen: { width, height },
        } = getState()

        dispatch(updateShipPosition(width * .5, height * .5))
    }
}

export const updateShip = () => {
    return (dispatch, getState) => {
        const {
            ship:   { x, y, vx, vy },
            game:   { moveControls: { up, right, down, left } },
            screen: { width, height },
        } = getState()

        if (!right && !left) {
            dispatch(updateShipVelocity('x', vx * SHIP_VELOCITY_INERTIA))
        } else {
            if (right && vx < SHIP_SPEED) {
                dispatch(updateShipVelocity('x', vx + SHIP_VELOCITY_STEP))
            } else if (left && vx > -SHIP_SPEED) {
                dispatch(updateShipVelocity('x', vx - SHIP_VELOCITY_STEP))
            }
        }

        if (!up && !down) {
            dispatch(updateShipVelocity('y', vy * SHIP_VELOCITY_INERTIA))
        } else {
            if (up && vy > -SHIP_SPEED) {
                dispatch(updateShipVelocity('y', vy - SHIP_VELOCITY_STEP))
            } else if (down && vy < SHIP_SPEED) {
                dispatch(updateShipVelocity('y', vy + SHIP_VELOCITY_STEP))
            }
        }

        const {
            x: constrainedX,
            y: constrainedY,
        } = positionRectConstrain({
            x: x + vx,
            y: y + vy,
        }, { x: 0, y: 0, width, height })

        dispatch(updateShipPosition(constrainedX, constrainedY))
    }
}
