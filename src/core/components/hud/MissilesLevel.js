import _      from 'lodash'
import React  from 'react'
import config from '../../../config'

const itemWidth = 260 / config.weapons.missiles.length

export default ({ level }) => (
    <div>
        <div className="hud__indicators__missiles__label">
            missiles level
        </div>
        <div className="hud__indicators__missiles">
            {_.range(config.weapons.missiles.length).map(i => (
                <span
                    key={i}
                    className={`hud__indicators__missiles__item${i < level ? ' _is-active' : ''}`}
                    style={{ width: itemWidth }}
                />
            ))}
        </div>
    </div>
)
