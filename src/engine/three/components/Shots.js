import _        from 'lodash'
import shotImg  from 'assets/graphics/three/shot_regular.png'
import {
    Points,
    Vector3,
    Geometry,
    TextureLoader,
    PointsMaterial,
    AdditiveBlending,
} from 'three'

export default (scene, store) => {
    const geometry  = new Geometry()
    _.range(200).forEach(() => {
        geometry.vertices.push(new Vector3(0, -100, 0))
    })

    const texture = new TextureLoader().load(shotImg)

    const particles = new Points(
        geometry,
        new PointsMaterial({
            size:            8,
            map:             texture,
            transparent:     true,
            depthTest:       true,
            blending:        AdditiveBlending,
            sizeAttenuation: false,
            fog:             false,
            lights:          false,
        })
    )
    scene.add(particles)

    return {
        update(shots, transpose) {
            geometry.vertices.forEach((v, i) => {
                if (shots[i]) {
                    const shot     = shots[i]
                    const { x, y, z } = transpose(shot)

                    v.x = x
                    v.y = y
                    v.z = z
                } else {
                    v.x = 0
                    v.y = -100
                    v.z = 0
                }
            })

            particles.geometry.verticesNeedUpdate = true
        },
    }
}