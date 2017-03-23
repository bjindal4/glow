import logoImg                from '../../assets/graphics/logo.png'
import shipImg                from '../../assets/graphics/ship.png'
import shipDamageImg          from '../../assets/graphics/ship_damage.png'
import shipShadowImg          from '../../assets/graphics/ship_shadow.png'
import shipTrailImg           from '../../assets/graphics/ship_trail.png'
import shotImg                from '../../assets/graphics/shot.png'
import shotSquareImg          from '../../assets/graphics/shot_square.png'
import shotHexagonImg         from '../../assets/graphics/shot_hexagon.png'
import asteroidImg            from '../../assets/graphics/asteroid.png'
import asteroidShadowImg      from '../../assets/graphics/asteroid_shadow.png'
import bonusShotImg           from '../../assets/graphics/bonus_shot.png'
import bonusMissileImg        from '../../assets/graphics/bonus_missile.png'
import bonusShieldImg         from '../../assets/graphics/bonus_shield.png'
import shieldIndicatorImg     from '../../assets/graphics/shield_indicator.png'
import bonusNightShiftImg     from '../../assets/graphics/bonus_night_shift.png'
import nightShiftIndicatorImg from '../../assets/graphics/night_shift_indicator.png'
import saucerImg              from '../../assets/graphics/saucer.png'
import saucerShadowImg        from '../../assets/graphics/saucer_shadow.png'
import missileImg             from '../../assets/graphics/missile.png'
import tileImg                from '../../assets/graphics/tile.png'
import displaceImg            from '../../assets/graphics/displacement_ring.png'
import pauseImg               from '../../assets/graphics/pause.png'
import darkenImg              from '../../assets/graphics/darken.png'
import lifeImg                from '../../assets/graphics/life.png'
import playButtonImg          from '../../assets/graphics/button_play.png'
import playButtonFocusImg     from '../../assets/graphics/button_play_focus.png'
import resumeButtonImg        from '../../assets/graphics/button_resume.png'
import resumeButtonFocusImg   from '../../assets/graphics/button_resume_focus.png'
import settingsButtonImg      from '../../assets/graphics/button_settings.png'
import settingsButtonFocusImg from '../../assets/graphics/button_settings_focus.png'
import helpButtonImg          from '../../assets/graphics/button_help.png'
import helpButtonFocusImg     from '../../assets/graphics/button_help_focus.png'
import quitButtonImg          from '../../assets/graphics/button_quit.png'
import quitButtonFocusImg     from '../../assets/graphics/button_quit_focus.png'
import creditsButtonImg       from '../../assets/graphics/button_credits.png'
import creditsButtonFocusImg  from '../../assets/graphics/button_credits_focus.png'
import continueButtonImg      from '../../assets/graphics/button_continue.png'
import continueButtonFocusImg from '../../assets/graphics/button_continue_focus.png'
import helpImg                from '../../assets/graphics/help.png'
import rewardImg              from '../../assets/graphics/reward.png'
import groundLightImg         from '../../assets/graphics/ground_light.png'
import goodLuckImg            from '../../assets/graphics/good_luck.png'
import shotsIconImg           from '../../assets/graphics/shots_icon.png'
import skullHeadImg           from '../../assets/graphics/skull_head.png'
import viewDirectionImg       from '../../assets/graphics/view_direction_base.png'
import viewDirectionArrowImg  from '../../assets/graphics/view_direction_arrow.png'

export default function () {
    return PIXI.loader
        .add('logo',                logoImg)
        .add('ship',                shipImg)
        .add('shipDamage',          shipDamageImg)
        .add('shipShadow',          shipShadowImg)
        .add('shipTrail',           shipTrailImg)
        .add('shot',                shotImg)
        .add('shotSquare',          shotSquareImg)
        .add('shotHexagon',         shotHexagonImg)
        .add('asteroid',            asteroidImg)
        .add('asteroidShadow',      asteroidShadowImg)
        .add('bonusShot',           bonusShotImg)
        .add('bonusMissile',        bonusMissileImg)
        .add('bonusShield',         bonusShieldImg)
        .add('shieldIndicator',     shieldIndicatorImg)
        .add('bonusNightShift',     bonusNightShiftImg)
        .add('nightShiftIndicator', nightShiftIndicatorImg)
        .add('saucer',              saucerImg)
        .add('saucerShadow',        saucerShadowImg)
        .add('missile',             missileImg)
        .add('tile',                tileImg)
        .add('displace',            displaceImg)
        .add('pause',               pauseImg)
        .add('darken',              darkenImg)
        .add('life',                lifeImg)
        .add('playButton',          playButtonImg)
        .add('playButtonFocus',     playButtonFocusImg)
        .add('resumeButton',        resumeButtonImg)
        .add('resumeButtonFocus',   resumeButtonFocusImg)
        .add('settingsButton',      settingsButtonImg)
        .add('settingsButtonFocus', settingsButtonFocusImg)
        .add('helpButton',          helpButtonImg)
        .add('helpButtonFocus',     helpButtonFocusImg)
        .add('quitButton',          quitButtonImg)
        .add('quitButtonFocus',     quitButtonFocusImg)
        .add('creditsButton',       creditsButtonImg)
        .add('creditsButtonFocus',  creditsButtonFocusImg)
        .add('continueButton',      continueButtonImg)
        .add('continueButtonFocus', continueButtonFocusImg)
        .add('help',                helpImg)
        .add('reward',              rewardImg)
        .add('groundLight',         groundLightImg)
        .add('goodLuck',            goodLuckImg)
        .add('shotsIcon',           shotsIconImg)
        .add('skullHead',           skullHeadImg)
        .add('viewDirection',       viewDirectionImg)
        .add('viewDirectionArrow',  viewDirectionArrowImg)
}