import EntityPool      from 'core/lib/EntityPool'
import { removePopup } from 'core/actions'
import Popup           from '../Popup'

export default class Popups extends PIXI.Container {
    constructor(store) {
        super()

        this.pool = new EntityPool({
            create: p => {
                const popup = Popup.fromText(p.text, p.color)
                popup.position.set(p.x, p.y)
                this.addChild(popup)
                popup.pop(() => { store.dispatch(removePopup(p.id)) })

                return popup
            },
            update: (popup, next) => {
            },
            remove: stale => {
                //stale.visible = false
            },
            recycle: (old, popup) => {
                old.id    = popup.id
                old.text  = popup.text
                old.color = popup.color
                old.position.set(popup.x, popup.y)
                old.pop(() => { store.dispatch(removePopup(popup.id)) })
            },
        })
    }

    update(popups) {
        this.pool.update(popups)
    }
}