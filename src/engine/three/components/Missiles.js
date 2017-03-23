import Pool     from 'core/lib/EntityPool'
import settings from '../settings'
import {
    Mesh,
    PlaneGeometry,
    MeshBasicMaterial,
} from 'three'

export default (scene, store) => {
    return new Pool({
        create: (m, transpose) => {
            const { x, z } = transpose(m)

            const mesh = new Mesh(
                new PlaneGeometry(6, 18, 4, 4),
                new MeshBasicMaterial({ color: 0xe753c6 })
            )
            mesh.rotation.x = -Math.PI * .5
            mesh.position.set(x, settings.groundOffset, z)

            scene.add(mesh)

            return { id: m.id, mesh }
        },
        update: (missile, next, transpose) => {
            const { x, y, z } = transpose(next)

            missile.mesh.position.x = x
            missile.mesh.position.z = z
            missile.mesh.rotation.y = next.rotation
        },
        remove: ({ mesh }) => {
            mesh.position.x = -500
            mesh.position.z =    0
            mesh.visible    = false
        },
        recycle: (old, missile, transpose) => {
            const { x, z } = transpose(missile)

            old.id           = missile.id
            old.mesh.position.set(x, settings.groundOffset, z)
            old.mesh.visible = true
        },
    })
}
