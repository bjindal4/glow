import _                           from 'lodash'
import TWEEN                       from 'tween.js'
import { rotation3dFromDirection } from 'core/lib/orient'
import tileImg                     from 'assets/graphics/three/tile.png'
import settings                    from '../../settings'
import {
    Mesh,
    Object3D,
    FlatShading,
    BoxGeometry,
    TextureLoader,
    PlaneGeometry,
    RepeatWrapping,
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

        this.length      = this.height * 3
        this.yOffset     = -100
        this.progression = 0

        this.buildGround()
        //this.buildRocks('left')
        //this.buildRocks('right')

        this.rotationAnchor.add(this.scroll)
        this.add(this.rotationAnchor)
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

    buildGround() {
        const texture  = new TextureLoader().load(tileImg)
        texture.wrapS  = RepeatWrapping
        texture.wrapT  = RepeatWrapping
        texture.repeat.set(14, 42)

        const material = new MeshPhongMaterial({
            map:       texture,
            //color:     '#ff0000',
            wireframe: false,
            shininess: 0,
        })

        const steps   = 36

        const groundGeometry = new PlaneGeometry(this.width, this.length, 1, steps)

        const markers = new Object3D()
        this.scroll.add(markers)

        const step = Math.PI * 2 / (steps - 1)

        _.range(steps + 1).forEach(i => {
            const y = Math.cos(i * step) * this.yOffset - this.yOffset

            groundGeometry.vertices[i * 2].z     = y
            groundGeometry.vertices[i * 2 + 1].z = y

            const geometry = new BoxGeometry(20, 20, 20, 1, 1, 1)
            const mesh     = new Mesh(geometry, new MeshLambertMaterial({
                color: '#ffffff',
            }))

            mesh.rotateX(Math.PI * -.5)
            mesh.position.z = this.length / 2 - i * (this.length / steps)
            mesh.position.y = y
            mesh.castShadow = true
            mesh.receiveShadow = true

            markers.add(mesh)
        })

        this.ground = new Mesh(groundGeometry, material)
        this.ground.position.set(0, 0, 0)
        this.ground.rotation.x    = -Math.PI * .5
        this.ground.rotation.z    = Math.PI
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
        this.progression += .004
        if (this.progression > 1) {
            this.progression = this.progression - 1
        }

        this.scroll.position.z = this.length * -.5 + this.progression * this.length
        this.scroll.position.y = Math.cos(Math.PI * 2 * this.progression) * -this.yOffset - this.yOffset - settings.groundOffset

        //this.scroll.position.z += settings.envSpeed
        //if (this.scroll.position.z >= this.height * .5) {
        //    this.scroll.position.z -= this.height
        //}
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
