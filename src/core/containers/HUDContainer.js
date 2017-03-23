import { connect } from 'react-redux'
import HUD         from '../components/hud/HUD'

const mapStateToProps = ({
    player:  { score, health, lives },
    weapons: { shots, missiles, shield },
    game:    { nightShift },
}) => {
    return {
        score,
        health,
        lives,
        shotsLevel:      shots.level,
        missilesLevel:   missiles.level,
        shieldIsEnabled: shield.isEnabled,
        nightIsEnabled:  nightShift.isEnabled,
    }
}

export default connect(mapStateToProps)(HUD)
