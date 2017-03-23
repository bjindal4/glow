import Pool            from 'core/lib/EntityPool'
import { removeBonus } from 'core/actions'
import shotImg         from 'assets/graphics/three/bonus_shot.png'
import missileImg      from 'assets/graphics/three/bonus_missile.png'
import shieldImg       from 'assets/graphics/three/bonus_shield.png'
import nightShiftImg   from 'assets/graphics/three/bonus_night_shift.png'
import settings        from '../settings'
import explode         from '../fx/explode'
import {
    Mesh,
    Object3D,
    PlaneGeometry,
    TorusGeometry,
    TextureLoader,
    MeshBasicMaterial,
    MeshPhongMaterial,
    ClampToEdgeWrapping,
} from 'three'
import config, {
    BONUS_TYPE_SHOT,
    BONUS_TYPE_MISSILE,
    BONUS_TYPE_SHIELD,
    BONUS_NIGHT_SHIFT,
} from '../../../config'

const imgMat = img => {
    const texture = new TextureLoader().load(img)
    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping

    return new MeshBasicMaterial({
        map:         texture,
        transparent: true,
        fog:         false,
        lights:      false,
    })
}

const ringMat = type => new MeshPhongMaterial({
    color:     config.bonuses[type].color,
    shininess: 10000,
})

const materialsByType = () => ({
    [BONUS_TYPE_SHOT]:    { img: imgMat(shotImg),       ring: ringMat(BONUS_TYPE_SHOT)    },
    [BONUS_TYPE_MISSILE]: { img: imgMat(missileImg),    ring: ringMat(BONUS_TYPE_MISSILE) },
    [BONUS_TYPE_SHIELD]:  { img: imgMat(shieldImg),     ring: ringMat(BONUS_TYPE_SHIELD)  },
    [BONUS_NIGHT_SHIFT]:  { img: imgMat(nightShiftImg), ring: ringMat(BONUS_NIGHT_SHIFT)  },
})

export default (scene, store) => {
    const rm = id => store.dispatch(removeBonus(id))

    const materials = materialsByType()

    return new Pool({
        create: (b, transpose) => {
            const { x, y, z } = transpose(b)

            const mesh = new Object3D()
            mesh.position.set(x, y, z)

            const img = new Mesh(new PlaneGeometry(48, 48, 4, 4), materials[b.type].img)
            img.rotation.x = -Math.PI * .5
            mesh.add(img)

            const ring = new Mesh(new TorusGeometry(18, 2, 12, 24), materials[b.type].ring)
            ring.rotation.x = -Math.PI * .5
            ring.castShadow = settings.castShadows
            mesh.add(ring)

            scene.add(mesh)

            return { id: b.id, type: b.type, mesh, img, ring }
        },
        update: (bonus, next, transpose) => {
            const { x, y, z } = transpose(next)

            bonus.mesh.position.x = x
            bonus.mesh.position.y = y
            bonus.mesh.position.z = z
            bonus.ring.rotation.x += 0.02
            bonus.ring.rotation.y += 0.02
            bonus.ring.rotation.z += 0.02

            if (next.pickedUp === true && bonus.pickedUp !== next.pickedUp) {
                rm(bonus.id)
                explode(scene, { x, y, z }, {
                    count:       5,
                    color:       config.bonuses[next.type].color,
                    radius:      38,
                    radiusVary:  0,
                    size:        18,
                    sizeVary:    0,
                    durationIn:  900,
                    durationOut: 300,
                    y:           0,
                    yVary:       0,
                    rotate:      false,
                })
            }
            bonus.pickedUp = next.pickedUp
        },
        remove: ({ mesh }) => {
            mesh.visible = false
        },
        recycle: (old, bonus, transpose) => {
            const { x, y, z } = transpose(bonus)

            old.id            = bonus.id
            old.pickedUp      = bonus.pickedUp
            old.img.material  = materials[bonus.type].img
            old.ring.material = materials[bonus.type].ring
            old.mesh.position.set(x, y, z)
            old.mesh.visible = true
        },
    })
}