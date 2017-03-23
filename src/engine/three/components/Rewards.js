import _         from 'lodash'
import rewardImg from 'assets/graphics/three/reward.png'
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
    _.range(160).forEach(() => {
        geometry.vertices.push(new Vector3(0, -100, 0))
    })

    const texture = new TextureLoader().load(rewardImg)

    const particles = new Points(
        geometry,
        new PointsMaterial({
            size:            16,
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
        update(rewards, transpose) {
            geometry.vertices.forEach((v, i) => {
                if (rewards[i]) {
                    const reward   = rewards[i]
                    const { x, y, z } = transpose(reward)

                    v.x = x
                    v.y = y// -10
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