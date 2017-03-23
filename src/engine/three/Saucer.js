import EntityPool      from 'core/lib/EntityPool'
import { removeEnemy } from 'core/actions'
import explode         from './fx/explode'
import {
    Mesh,
    TorusGeometry,
    MeshPhongMaterial,
} from 'three'

export default (scene, store) => {
    const rm = id => store.dispatch(removeEnemy(id))

    const geometry = new TorusGeometry(22, 6, 4, 6)
    const material = new MeshPhongMaterial({ color: 0x35eff5 })

    return new EntityPool({
        create: (s, transpose) => {
            const { x, y, z } = transpose(s)

            const mesh = new Mesh(geometry, material)
            mesh.castShadow = true
            mesh.rotation.x = -Math.PI * .5
            mesh.position.set(x, y, z)
            scene.add(mesh)

            return { id: s.id, mesh, health: s.health, age: s.age, hitCount: s.hitCount }
        },
        update: (saucer, next, transpose) => {
            const { x, y, z, rotateZ } = transpose(next)

            saucer.age = next.age
            saucer.mesh.position.set(x, y, z)
            saucer.mesh.rotation.y = rotateZ

            if (next.hitCount > saucer.hitCount) {
                explode(scene, { x, y, z }, {
                    count:       5,
                    color:       '#35eff5',
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
                })
            }
            saucer.hitCount = next.hitCount

            if (next.health === 0 && saucer.health !== 0) {
                rm(saucer.id)
                explode(scene, { x, y, z }, {
                    color: 0x35eff5,
                })
            }
            saucer.health = next.health
        },
        remove: ({ mesh }) => {
            mesh.position.x = -500
            mesh.position.z =    0
            mesh.visible    = false
        },
        recycle: (old, saucer, transpose) => {
            const { x, y, z } = transpose(saucer)

            old.id              = saucer.id
            old.health          = saucer.health
            old.age             = saucer.age
            old.mesh.rotation.x = -Math.PI * .5
            old.mesh.position.set(x, y, z)
            old.mesh.visible    = true
        },
    })
}