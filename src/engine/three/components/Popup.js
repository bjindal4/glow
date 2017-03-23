import TWEEN           from 'tween.js'
import Pool            from 'core/lib/EntityPool'
import { removePopup } from 'core/actions'
import {
    Mesh,
    Texture,
    PlaneGeometry,
    MeshBasicMaterial,
    AdditiveBlending,
} from 'three'

const texturesByLabelAndColor = {}

const getLabelTexture = (text, color) => {
    const key = `${text}.${color}`
    if (texturesByLabelAndColor[key]) return texturesByLabelAndColor[key]

    const canvas  = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width  = 256
    canvas.height = 256

    let fontsize = 42
    do {
        fontsize--
        context.font = `bold ${fontsize}pt Arial`
    } while (context.measureText(text).width > canvas.width)

    context.textAlign = 'center'
    context.fillStyle = color
    context.fillText(text, canvas.width / 2, canvas.height / 2 + fontsize / 2)

    const texture = new Texture(canvas)
    texture.needsUpdate = true

    texturesByLabelAndColor[key] = texture

    return texture
}

export default class Popup {
    static pool(scene, store) {
        const { screen: { width, height } } = store.getState()

        const x  = x => x - width  * .5
        const z  = y => y - height * .5

        const rm = id => store.dispatch(removePopup(id))

        return new Pool({
            create: _popup => {
                const popup = new Popup(_popup.id, _popup.text, _popup.color, rm)
                popup.mesh.position.set(x(_popup.x), 0, z(_popup.y))
                scene.add(popup.mesh)
                popup.pop()

                return popup
            },
            update: () => {},
            remove: ({ mesh }) => {
                mesh.visible    = false
                mesh.position.x = -500
                mesh.position.z =    0
            },
            recycle: (old, popup) => {
                old.id = popup.id
                old.mesh.position.set(x(popup.x), 0, z(popup.y))
                old.mesh.material.map = getLabelTexture(popup.text, popup.color)
                old.pop()
                old.mesh.visible = true
            },
        })
    }

    constructor(id, text, color, rm) {
        this.id   = id
        this.rm   = rm

        const texture = getLabelTexture(text, color)

        this.mesh = new Mesh(
            new PlaneGeometry(100, 100, 4, 4),
            new MeshBasicMaterial({
                map:         texture,
                transparent: true,
                blending:    AdditiveBlending,
                depthTest:   false,
            })
        )
        this.mesh.rotation.x = -Math.PI * .25
    }

    pop() {
        if (this.tween) {
            this.tween.stop()
            this.leaveTween.stop()
        }

        this.mesh.position.y = 0
        this.mesh.scale.set(.1, .1, .1)

        const self = this
        this.tween = new TWEEN.Tween({
            y:     0,
            scale: .1,
        })
            .to({
                y:     160,
                scale: 1,
            }, 1200)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function () {
                self.mesh.position.y = this.y
                self.mesh.scale.set(this.scale, this.scale, this.scale)
            })

        this.leaveTween = new TWEEN.Tween({
            z:     this.mesh.position.z,
            scale: 1,
        })
            .to({
                z:     this.mesh.position.z -800,
                scale: .1,
            }, 600)
            .easing(TWEEN.Easing.Exponential.In)
            .onUpdate(function () {
                self.mesh.position.z = this.z
                self.mesh.scale.set(this.scale, this.scale, this.scale)
            })
            .onComplete(() => {
                this.rm(this.id)
            })


        this.tween.chain(this.leaveTween)

        this.tween.start()
    }
}