import _      from 'lodash'
import React  from 'react'
import config from '../../../config'

const itemWidth = 260 / config.weapons.shots.length

export default ({ level }) => (
    <div>
        <div className="hud__indicators__shots__label">
            shooting level
        </div>
        <div className="hud__indicators__shots">
            {_.range(config.weapons.shots.length).map(i => (
                <span
                    key={i}
                    className={`hud__indicators__shots__item${i < level ? ' _is-active' : ''}`}
                    style={{ width: itemWidth }}
                />
            ))}
        </div>
    </div>
)
