import TWEEN                       from 'tween.js'
import { rotation3dFromDirection } from 'core/lib/orient'
import shipImg                     from 'assets/graphics/three/ship.png'
import glowImg                     from 'assets/graphics/three/ship_trail_glow.png'
import settings                    from '../settings'
import ColladaLoader               from 'three-collada-loader'
import shipModel                   from '../models/ship_A_01.dae'
import {
    Mesh,
    Sprite,
    Object3D,
    TextureLoader,
    SpriteMaterial,
    AdditiveBlending,
    MeshLambertMaterial,
} from 'three'

export default class Ship extends Object3D {
    constructor() {
        super()

        const shipMap = new TextureLoader().load(shipImg)

        const loader = new ColladaLoader()
        loader.options.convertUpAxis = true
        loader.load(shipModel, collada => {
            const dae = collada.scene
            dae.scale.x = dae.scale.y = dae.scale.z = 12
            dae.traverse(child => {
                if (child.type === 'Mesh') {
                    child.material =  new MeshLambertMaterial({
                        map: shipMap,
                    })
                    child.castShadow = settings.castShadows
                }
            })
            dae.updateMatrix()

            this.add(dae)
        })

        const glowMap = new TextureLoader().load(glowImg)
        const glow = new Sprite(new SpriteMaterial({
            map:         glowMap,
            transparent: false,
            blending:    AdditiveBlending,
            depthTest:   false,
            fog:         false,
        }))
        glow.scale.set(160, 160, 1.0)
        glow.position.set(0, 6, 42)
        this.add(glow)
    }

    set direction(direction) {
        if (direction === this._direction) return

        this._direction = direction

        if (this.directionTween) this.directionTween.stop()

        const self = this

        const rotation        = rotation3dFromDirection(this._direction)
        const initialRotation = self.rotation.y

        this.directionTween = new TWEEN.Tween({ rotation: initialRotation })
            .to({ rotation }, 1000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () {
                self.rotation.y = this.rotation
            })

        this.directionTween.start()
    }

    update() {
        //this.position.y = settings.groundOffset// + Math.cos(Date.now() * 0.005) * 20
    }
}