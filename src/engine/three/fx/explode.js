import TWEEN    from 'tween.js'
import Vector2D from 'victor'
import _        from 'lodash'
import {
    Mesh,
    Object3D,
    FlatShading,
    MeshPhongMaterial,
    DodecahedronGeometry,
} from 'three'

export default (scene, pos, {
    count        = 12,
    color        = 0xff0000,
    radius       = 50,
    radiusVary   = 40,
    size         = 17,
    sizeVary     = 14,
    durationIn   = 600,
    durationOut  = 200,
    y            = 200,
    yVary        = 200,
    yOffset      = 200,
    rotate       = true,
    xRotation    = 0,
    yRotation    = 0,
    zRotation    = 0,
}) => {
    const root = new Object3D()
    root.position.set(pos.x, pos.y, pos.z)
    root.rotateX(xRotation)
    root.rotateY(yRotation)
    root.rotateZ(zRotation)

    scene.add(root)

    const material = new MeshPhongMaterial({
        color,
        shading: FlatShading,
    })

    _.range(count).forEach(i => {
        const particle = new Mesh(
            new DodecahedronGeometry(sizeVary === 0 ? size : size - sizeVary * .5 + Math.random() * sizeVary * .5),
            material
        )
        particle.castShadow = false

        const vec = new Vector2D(0, 1)
        vec.rotate(Math.PI + Math.PI * 2 / count * i)

        const length = radiusVary === 0 ? radius : radius - radiusVary * .5 + Math.random() * radiusVary * .5

        particle.ptarget = {
            x: vec.x * length,
            y: yVary === 0 ? y : y - yVary * .5 + Math.random() * yVary * .5,
            z: vec.y * length,
            r: rotate ? Math.PI * 4 * Math.random() : 0,
        }

        root.add(particle)
    })

    const tweenIn = new TWEEN.Tween({ time: 0 })
        .to({ time: 1 }, durationIn)
        .easing(TWEEN.Easing.Exponential.Out)
        .onStart(() => {
            root.visible = true
        })
        .onUpdate(function () {
            root.children.forEach(p => {
                p.position.x = p.ptarget.x * this.time
                p.position.z = p.ptarget.z * this.time
                p.position.y = p.ptarget.y * this.time

                p.rotation.y = p.ptarget.r * this.time

                const scale = (1 - this.time) * .6 + .4
                p.scale.set(scale, scale, scale)
            })
        })

    const tweenOut = new TWEEN.Tween({ time: 0 })
        .to({ time: 1 }, durationOut)
        .easing(TWEEN.Easing.Exponential.In)
        .onUpdate(function () {
            root.children.forEach(p => {
                p.position.y = p.ptarget.y + this.time * yOffset

                const scale = .4 - (this.time * .59)
                p.scale.set(scale, scale, scale)
            })
        })
        .onComplete(() => {
            root.visible = false
            scene.remove(root)
        })

    tweenIn.chain(tweenOut).start()
}
