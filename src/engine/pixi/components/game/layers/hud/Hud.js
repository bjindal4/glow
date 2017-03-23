import HealthIndicator        from './HealthIndicator'
import LivesIndicator         from './LivesIndicator'
import ShotsLevelIndicator    from './ShotsLevelIndicator'
import MissilesLevelIndicator from './MissilesLevelIndicator'
import DirectionIndicator     from './DirectionIndicator'

const { resources } = PIXI.loader

export default class Hud extends PIXI.Container {
    constructor(screenWidth, screenHeight) {
        super()

        this.screenWidth  = screenWidth
        this.screenHeight = screenHeight

        this.isPaused = false

        this.livesIndicator = new LivesIndicator()
        this.livesIndicator.x = 20
        this.livesIndicator.y = 44
        this.addChild(this.livesIndicator)

        this.healthIndicator = new HealthIndicator()
        this.healthIndicator.x = 20
        this.healthIndicator.y = 74
        this.addChild(this.healthIndicator)

        this.shotsLevelIndicator = new ShotsLevelIndicator()
        this.shotsLevelIndicator.x = 20
        this.shotsLevelIndicator.y = this.screenHeight - 106
        this.addChild(this.shotsLevelIndicator)

        this.missilesLevelIndicator = new MissilesLevelIndicator()
        this.missilesLevelIndicator.x = 20
        this.missilesLevelIndicator.y = this.screenHeight - 60
        this.addChild(this.missilesLevelIndicator)

        this.directionIndicator = new DirectionIndicator()
        this.directionIndicator.position.set(150, this.screenHeight - 155)
        this.addChild(this.directionIndicator)

        this.nightShiftIndicator = new PIXI.Sprite(resources.nightShiftIndicator.texture)
        this.nightShiftIndicator.anchor.set(.5)
        this.nightShiftIndicator.position.set(34, this.screenHeight - 135)
        this.nightShiftIndicator.alpha = .35
        this.addChild(this.nightShiftIndicator)

        this.shieldIndicator = new PIXI.Sprite(resources.shieldIndicator.texture)
        this.shieldIndicator.anchor.set(.5)
        this.shieldIndicator.position.set(34, this.screenHeight - 175)
        this.shieldIndicator.alpha = .35
        this.addChild(this.shieldIndicator)

        this.buildLogo()
        this.buildScore()
    }

    buildLogo() {
        this.logo = new PIXI.Sprite(resources.logo.texture)

        this.logo.anchor.set(1, 0)
        this.logo.scale.set(.7)
        this.logo.position.set(this.screenWidth - 20, 20)

        this.addChild(this.logo)
    }

    buildScore() {
        this.score = new PIXI.Text('score: 0', {
            fontFamily: 'Arial',
            fontSize:   14,
            fill:       '#fd72fa',
            align:      'left',
        })

        this.score.x = 20
        this.score.y = 18

        this.addChild(this.score)
    }

    update({ direction, nightShiftEnabled, score, health, lives, shotsLevel, missilesLevel }) {
        this.nightShiftIndicator.alpha = nightShiftEnabled ? 1 : .35
        this.score.text = `score: ${score}`
        this.healthIndicator.setHealth(health)
        this.livesIndicator.setLives(lives)
        this.shotsLevelIndicator.level    = shotsLevel
        this.missilesLevelIndicator.level = missilesLevel
        this.directionIndicator.direction = direction
    }
}