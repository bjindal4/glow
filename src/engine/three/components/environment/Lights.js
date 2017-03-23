import TWEEN                       from 'tween.js'
import { rotation3dFromDirection } from 'core/lib/orient'
import settings                    from '../../settings'
import {
    Object3D,
    DirectionalLight,
    SpotLight,
    HemisphereLight,
} from 'three'

const SHADOW_MAP_SIZE            = settings.shadowMapSize
const DIR_LIGHT_INTENSITY        = .7
const DIR_LIGHT_NIGHT_INTENSITY  = .3
const HEMI_LIGHT_INTENSITY       = .8
const HEMI_LIGHT_NIGHT_INTENSITY = .3
const SHIP_SPOT_INTENSITY        = 10
const SHIP_SPOT_ANGLE            = Math.PI * .2
const SHIP_SPOT_NIGHT_ANGLE      = Math.PI * .3

export default class Lights {
    constructor(scene) {
        this._nightShiftEnabled = false

        this.dirlight = new DirectionalLight(0xee92d9, DIR_LIGHT_INTENSITY)
        this.dirlight.position.set(0, 600, -100)
        this.dirlight.castShadow            = settings.castShadows
        this.dirlight.shadow.camera.left    = -1600
        this.dirlight.shadow.camera.right   =  1600
        this.dirlight.shadow.camera.top     =  1600
        this.dirlight.shadow.camera.bottom  = -1600
        this.dirlight.shadow.camera.near    = 1
        this.dirlight.shadow.camera.far     = 800
        this.dirlight.shadow.bias           = .001
        this.dirlight.shadow.mapSize.width  = SHADOW_MAP_SIZE
        this.dirlight.shadow.mapSize.height = SHADOW_MAP_SIZE
        scene.add(this.dirlight)

        this.hemiLight = new HemisphereLight(0xffffff, 0xff45d6, HEMI_LIGHT_INTENSITY)
        this.hemiLight.position.set(0, 600, 0)
        scene.add(this.hemiLight)

        this.shipSpot = new SpotLight(0xf269d4, SHIP_SPOT_INTENSITY, 500, SHIP_SPOT_ANGLE)
        this.shipSpot.penumbra = .3
        scene.add(this.shipSpot)

        this.shipSpotTargetRoot        = new Object3D()
        this.shipSpotTarget            = new Object3D()
        this.shipSpotTarget.position.x = 600
        this.shipSpot.target           = this.shipSpotTarget
        this.shipSpotTargetRoot.add(this.shipSpotTarget)

        scene.add(this.shipSpotTargetRoot)
    }

    set shipPosition(position) {
        this.shipSpot.position.x = position.x
        this.shipSpot.position.y = position.y
        this.shipSpot.position.z = position.z

        this.shipSpotTargetRoot.position.x = position.x //(state.ship.x - width * .5) * .2,
        this.shipSpotTargetRoot.position.y = 0
        this.shipSpotTargetRoot.position.z = position.z
    }

    set direction(direction) {
        if (direction === this._direction) return

        this._direction = direction

        if (this.directionTween) this.directionTween.stop()

        const self = this

        const rotation        = rotation3dFromDirection(this._direction) + Math.PI * .5
        const initialRotation = this.shipSpotTargetRoot.rotation.y

        this.directionTween = new TWEEN.Tween({ rotation: initialRotation })
            .to({ rotation }, 2000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () {
                self.shipSpotTargetRoot.rotation.y = this.rotation
            })

        this.directionTween.start()
    }

    set nightShift(isEnabled) {
        if (isEnabled === this._nightShiftEnabled) return

        this._nightShiftEnabled = isEnabled

        if (this.nightTween) this.nightTween.stop()

        let dirTo   = DIR_LIGHT_INTENSITY
        let hemiTo  = HEMI_LIGHT_INTENSITY
        let angleTo = SHIP_SPOT_ANGLE
        if (isEnabled) {
            dirTo   = DIR_LIGHT_NIGHT_INTENSITY
            hemiTo  = HEMI_LIGHT_NIGHT_INTENSITY
            angleTo = SHIP_SPOT_NIGHT_ANGLE
        }

        const self = this

        this.nightTween = new TWEEN.Tween({
            dir:   this.dirlight.intensity,
            hemi:  this.hemiLight.intensity,
            angle: this.shipSpot.angle,
        })
            .to({
                dir:   dirTo,
                hemi:  hemiTo,
                angle: angleTo,
            }, 1200)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () {
                self.dirlight.intensity  = this.dir
                self.hemiLight.intensity = this.hemi
                self.shipSpot.angle      = this.angle
            })

        this.nightTween.start()
    }
}