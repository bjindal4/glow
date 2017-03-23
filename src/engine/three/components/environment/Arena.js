import _                           from 'lodash'
import TWEEN                       from 'tween.js'
import { rotation3dFromDirection } from 'core/lib/orient'
import tileImg                     from 'assets/graphics/three/tile.png'
import settings                    from '../../settings'
import {
    Mesh,
    BackSide,
    Object3D,
    FlatShading,
    TextureLoader,
    PlaneGeometry,
    RepeatWrapping,
    CylinderGeometry,
    MeshPhongMaterial,
    MeshLambertMaterial,
    DodecahedronGeometry,
} from 'three'

export default class Arena extends Object3D {
    constructor(width, height) {
        super()

        this.width  = width
        this.height = height

        this.rotationAnchor = new Object3D()
        this.scroll         = new Object3D()

        //this.buildBoundaries()
        //this.buildRocks('left')
        //this.buildRocks('right')

        this.buildTube()

        this.rotationAnchor.add(this.scroll)
        this.add(this.rotationAnchor)
    }

    buildTube() {
        const geometry = new CylinderGeometry(
            settings.tubeRadius,      // top radius
            settings.tubeRadius,      // bottom radius
            this.height * 3,          // height
            16,                       // radiusSegments
            1,                        // heightSegments
            true,                     // openEnded
            settings.tubeAngle * -.5, // thetaStart
            settings.tubeAngle        // thetaLength
        )

        const texture  = new TextureLoader().load(tileImg)
        texture.wrapS  = RepeatWrapping
        texture.wrapT  = RepeatWrapping
        texture.repeat.set(16, 48)

        const material = new MeshPhongMaterial({
            map:       texture,
            side:      BackSide,
            //shininess: 0,
            wireframe: false,
        })

        const tube = new Mesh(geometry, material)
        tube.position.y = settings.tubeRadius
        tube.rotation.x = Math.PI * .5
        tube.receiveShadow = settings.castShadows
        this.scroll.add(tube)
    }

    buildRocks(side) {
        const material = new MeshPhongMaterial({
            color:     0x191117,
            wireframe: false,
            shading:   FlatShading,
            shininess: 0,
        })

        const baseX = side === 'left' ? this.width * .6 : this.width * -.6

        const rocks = []

        let z = 0
        while (z < this.height) {
            const radius = 20 + Math.random() * 40

            z += radius

            const geometry = new DodecahedronGeometry(radius * 2)

            rocks.push({
                geometry,
                position: {
                    x: baseX + Math.random() * 100 - 40,
                    y: Math.random() * radius,
                    z,
                },
                rotation: {
                    x: Math.random() * Math.PI * 2,
                    y: Math.random() * Math.PI * 2,
                    z: Math.random() * Math.PI * 2,
                }
            })

            z += radius
        }

        _.range(3).forEach(i => {
            rocks.forEach(rock => {
                const mesh = new Mesh(rock.geometry, material)

                mesh.position.x    = rock.position.x
                mesh.position.y    = rock.position.y
                mesh.position.z    = rock.position.z - this.height * 1.5 + this.height * i

                mesh.rotateX(rock.rotation.x)
                mesh.rotateY(rock.rotation.y)
                mesh.rotateZ(rock.rotation.z)

                mesh.castShadow    = settings.castShadows
                mesh.receiveShadow = settings.castShadows

                this.scroll.add(mesh)
            })
        })
    }

    buildBoundaries() {
        const texture  = new TextureLoader().load(tileImg)
        texture.wrapS  = RepeatWrapping
        texture.wrapT  = RepeatWrapping
        texture.repeat.set(14, 42)

        const material = new MeshPhongMaterial({
            map:       texture,
            shininess: 0,
        })

        this.ground = new Mesh(new PlaneGeometry(this.width * 1.2, this.height * 3, 4, 4), material)
        this.ground.position.set(0, 0, 0)
        this.ground.rotation.x    = -Math.PI * .5
        this.ground.receiveShadow = settings.castShadows
        this.scroll.add(this.ground)

        const outerMaterial = new MeshLambertMaterial({
            color: 0x210f1d,
        })

        this.underground = new Mesh(new PlaneGeometry(this.width * 3, this.height * 3, 4, 4), outerMaterial)
        this.underground.position.y    = -1
        this.underground.rotation.x    = -Math.PI * .5
        this.underground.receiveShadow = settings.castShadows
        //this.scroll.add(this.underground)
    }

    update() {
        this.scroll.position.z += settings.envSpeed
        if (this.scroll.position.z >= this.height * .5) {
            this.scroll.position.z -= this.height
        }
    }

    set direction(direction) {
        if (direction === this._direction) return

        this._direction = direction

        if (this.directionTween) this.directionTween.stop()

        const self = this

        const rotation        = rotation3dFromDirection(this._direction)
        const initialRotation = this.rotationAnchor.rotation.y

        this.directionTween = new TWEEN.Tween({ rotation: initialRotation })
            .to({ rotation }, 1000)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate(function () {
                self.rotationAnchor.rotation.y = this.rotation
            })

        this.directionTween.start()
    }
}
