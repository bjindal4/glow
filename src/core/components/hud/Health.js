import React          from 'react'
import { MAX_HEALTH } from '../../constants'

export default ({ health }) => (
    <div>
        <div className="hud__health__label">
            health
        </div>
        <div className="hud__health__bar">
            <span
                className="hud__health__bar__inner"
                style={{
                    width: Math.max(0, health / MAX_HEALTH * 260),
                }}
            />
        </div>
    </div>
)
