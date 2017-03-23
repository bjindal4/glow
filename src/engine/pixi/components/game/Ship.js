import _                          from 'lodash'
import Keyboard                   from 'keyboardjs'
import TWEEN                      from 'tween.js'
import { rotationFromDirection }  from 'core/lib/orient'

const { resources } = PIXI.loader

const initialTrailPoints = [
    { x: 0, y:   0 },
    { x: 0, y:  10 },
    { x: 0, y:  40 },
    { x: 0, y:  80 },
    { x: 0, y: 120 },
]

export default class Ship extends PIXI.Container {
    constructor(store) {
        super()

        this.store = store

        this.visible  = false
        this.isActive = false

        this._direction = store.getState().game.direction

        this.shadow = new PIXI.Sprite(resources.shipShadow.texture)
        this.shadow.y = 20
        this.shadow.pivot.set(32, 32)
        this.addChild(this.shadow)

        this.trailPoints = _.cloneDeep(initialTrailPoints)

        this.trail = new PIXI.mesh.Rope(
            resources.shipTrail.texture,
            this.trailPoints
        )
        this.trail.pivot.set(0, -30)
        this.addChild(this.trail)

        this.ship = new PIXI.Sprite(resources.ship.texture)
        this.ship.anchor.set(.5, .5)
        this.addChild(this.ship)

        this.damage = new PIXI.Sprite(resources.shipDamage.texture)
        this.damage.pivot.set(32, 32)
        this.damage.alpha = 0
        this.addChild(this.damage)

        const self = this

        this.winkTween = new TWEEN.Tween(this)
            .to({ alpha: .4 }, 400)
            .repeat(Infinity)
            .yoyo(true)
            .onStop(() => {
                this.alpha = 1
            })

        this.damageTween = new TWEEN.Tween({ alpha: 0 })
            .to({ alpha: 1 }, 600)
            .repeat(2)
            .yoyo(true)
            .onUpdate(function () {
                self.damage.alpha = this.alpha
            })
            .onComplete(() => {
                this.damage.alpha = 0
            })
    }

    hit() {
        this.damageTween.start()
    }

    collision() {
        /*
        this.vx = Math.random() * 30 -15
        this.vy = Math.random() * 30 -15

        const self = this

        if (this.collisionTween) this.collisionTween.stop()

        this.collisionTween = new TWEEN.Tween({ rotation: 0 })
            .to({
                rotation: Math.PI * 2 * (Math.random() < .5 ? 1 : -1),
            }, 3000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onStart(() => {
            })
            .onUpdate(function () {
                self.shadow.rotation = self.damage.rotation = self.trail.rotation = self.ship.rotation = this.rotation
            })
            .onStop(() => {
                this.shadow.rotation = this.damage.rotation = this.trail.rotation = this.ship.rotation = 0
            })

        this.collisionTween.start()
        */
    }

    launch() {
        this.isActive = false
        this.visible  = false

        this.trailPoints = _.cloneDeep(initialTrailPoints)

        const self = this

        if (this.collisionTween) this.collisionTween.stop()
        if (this.launchTween)    this.launchTween.stop()

        this.launchTween = new TWEEN.Tween({ scale: 2, y: -200 })
            .to({ scale: 1, y: 0 }, 800)
            .delay(400)
            .easing(TWEEN.Easing.Exponential.Out)
            .onStart(() => {
                this.visible = true
                self.winkTween.start()
            })
            .onUpdate(function () {
                self.ship.scale.x   = self.ship.scale.y   = this.scale
                self.trail.scale.x  = self.trail.scale.y  = this.scale
                self.shadow.scale.x = self.shadow.scale.y = this.scale
                self.ship.y = self.trail.y = this.y
                self.shadow.y = this.y * 1.5 + 20
            })
            .onComplete(() => {
                this.isActive = true
                self.winkTween.stop()
            })

        this.launchTween.start()
    }

    set direction(direction) {
        if (direction === this._direction) return

        this._direction = direction

        if (this.directionTween) this.directionTween.stop()

        const self = this

        const rotation        = rotationFromDirection(this._direction)
        const initialRotation = rotation === 0 ? this.ship.rotation - Math.PI * 2 : this.ship.rotation

        this.directionTween = new TWEEN.Tween({ rotation: initialRotation })
            .to({ rotation }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function () {
                self.ship.rotation   = this.rotation
                self.shadow.rotation = this.rotation
                self.trail.rotation  = this.rotation
            })

        this.directionTween.start()
    }

    tick() {
        if (!this.isActive) return

        const { ship: { x, y, vx, vy } } = this.store.getState()

        this.position.set(x, y)

        this.shadow.position.set(vx * -.5, vy * -.5 + 20)

        const totalLength = 120 - vy * 6
        this.trailPoints[2].x = -vx * .7
        this.trailPoints[2].y = totalLength * .33
        this.trailPoints[3].x = -vx * 1.8
        this.trailPoints[3].y = totalLength * .66
        this.trailPoints[4].x = -vx * 4
        this.trailPoints[4].y = totalLength
    }
}
