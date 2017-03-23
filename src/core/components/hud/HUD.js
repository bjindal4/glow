import '../../styles/HUD.css'
import React, { Component } from 'react'
import Score                from './Score'
import Health               from './Health'
import Lives                from './Lives'
import ShootingLevel        from './ShootingLevel'
import MissilesLevel        from './MissilesLevel'

export default class HUD extends Component {
    render() {
        const {
            score,
            health,
            lives,
            shotsLevel,
            missilesLevel,
            shieldIsEnabled,
            nightIsEnabled,
        } = this.props

        return (
            <div className="hud">
                <div className="hud__main">
                    <Score score={score}/>
                    <Health health={health}/>
                    <Lives lives={lives}/>
                </div>
                <div className="hud__indicators">
                    <ShootingLevel level={shotsLevel}/>
                    <MissilesLevel level={missilesLevel}/>
                    <div className="hud__indicators__icons">
                        <span className={`hud__indicators__night${nightIsEnabled ? ' _is-active' : ''}`}/>
                        <span className={`hud__indicators__shield${shieldIsEnabled ? ' _is-active' : ''}`}/>
                    </div>
                </div>
            </div>
        )
    }
}