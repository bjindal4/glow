import TWEEN                  from 'tween.js'
import HealthIndicator        from './HealthIndicator'
import LivesIndicator         from './LivesIndicator'
import ShotLevelIndicator     from './ShotLevelIndicator'
import MissilesLevelIndicator from './MissilesLevelIndicator'

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

        this.shotLevelIndicator = new ShotLevelIndicator()
        this.shotLevelIndicator.x = 20
        this.shotLevelIndicator.y = this.screenHeight - 106
        this.addChild(this.shotLevelIndicator)

        this.missilesLevelIndicator = new MissilesLevelIndicator()
        this.missilesLevelIndicator.x = 20
        this.missilesLevelIndicator.y = this.screenHeight - 60
        this.addChild(this.missilesLevelIndicator)

        this.buildLogo()
        this.buildScore()
        this.buildCopyright()
    }

    buildLogo() {
        this.logo = new PIXI.Sprite(resources.logo.texture)

        this.logo.anchor.set(.5, .5)
        this.logo.x      = this.screenWidth  * .5
        this.logo.y      = 60

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

    buildCopyright() {
        this.copyright = new PIXI.Text(`© Raphaël Benitte - 2017`, {
            fontFamily: 'Arial',
            fontSize:   14,
            fill:       '#9c4b99',
            align:      'right',
        })
        this.copyright.x = this.screenWidth - 20 - this.copyright.width
        this.copyright.y = this.screenHeight - 36
        this.addChild(this.copyright)
    }

    update({ score, health, lives, shotLevel, missilesLevel }) {
        this.score.text = `score: ${score}`
        this.healthIndicator.setHealth(health)
        this.livesIndicator.setLives(lives)
        this.shotLevelIndicator.level     = shotLevel
        this.missilesLevelIndicator.level = missilesLevel
    }
}