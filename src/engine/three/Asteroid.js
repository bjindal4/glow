import EntityPool      from 'core/lib/EntityPool'
import { removeEnemy } from 'core/actions'
import lavaImg         from 'assets/graphics/three/lava.jpg'
import lavaEmissiveImg from 'assets/graphics/three/lava_emissive.jpg'
import lavaSpecularImg from 'assets/graphics/three/lava_specular.png'
import explode         from './fx/explode'
import settings, {
    QUALITY_LOW,
} from './settings'
import {
    Mesh,
    FlatShading,
    TextureLoader,
    MeshPhongMaterial,
    DodecahedronGeometry,
} from 'three'

export default (scene, store) => {
    const rm = id => store.dispatch(removeEnemy(id))

    const lavaMap  = new TextureLoader().load(lavaImg)
    const material = new MeshPhongMaterial({
        map:       lavaMap,
        shading:   FlatShading,
        shininess: 3,
    })

    if (settings.quality > QUALITY_LOW) {
        material.specularMap       = new TextureLoader().load(lavaSpecularImg)
        material.emissiveMap       = new TextureLoader().load(lavaEmissiveImg)
        material.emissiveIntensity = 20
    }

    return new EntityPool({
        create: (a, transpose) => {
            const { x, y, z } = transpose(a)

            const mesh = new Mesh(
                new DodecahedronGeometry(Math.random() * 16 + 20),
                material,
            )
            mesh.castShadow = true
            mesh.rotation.x = -Math.PI * .5
            mesh.position.set(x, y, z)
            scene.add(mesh)

            return { id: a.id, mesh, health: a.health, age: a.age, hitCount: a.hitCount }
        },
        update: (asteroid, next, transpose) => {
            const { x, y, z } = transpose(next)

            asteroid.age             = next.age
            asteroid.mesh.rotation.z += 0.03
            asteroid.mesh.position.set(x, y, z)

            if (next.hitCount > asteroid.hitCount) {
                explode(scene, { x, y: settings.groundOffset, z }, {
                    count:       5,
                    color:       '#6e1416',
                    radius:      52,
                    radiusVary:  0,
                    size:        12,
                    sizeVary:    0,
                    durationIn:  200,
                    durationOut: 200,
                    y:           0,
                    yVary:       0,
                    yOffset:     0,
                    rotate:      false,
                    xRotation:   0,
                })
            }
            asteroid.hitCount = next.hitCount

            if (next.health === 0 && asteroid.health !== 0) {
                rm(asteroid.id)
                explode(scene, { x, y, z }, {
                    color:    0x221111,
                    size:     36,
                    sizeVary: 30,
                })
            }
            asteroid.health = next.health
        },
        remove: ({ mesh }) => {
            mesh.position.x = -500
            mesh.position.z =    0
            mesh.visible    = false
        },
        recycle: (old, asteroid, transpose) => {
            const { x, y, z } = transpose(asteroid)

            old.id              = asteroid.id
            old.health          = asteroid.health
            old.age             = asteroid.age
            old.mesh.rotation.x = -Math.PI * .5
            old.mesh.position.set(x, y, z)
            old.mesh.visible    = true
        },
    })
}