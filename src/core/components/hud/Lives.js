import _     from 'lodash'
import React from 'react'

export default ({ lives }) => (
    <div className="hud__lives">
        <span>lives</span>
        <div className="hud__lives__items">
            {_.range(lives).map(i => (
                <span
                    key={i}
                    className="hud__lives__item"
                />
            ))}
        </div>
    </div>
)
