import React        from 'react'
import ReactDOM     from 'react-dom'
import { Provider } from 'react-redux'
import HUD          from '../containers/HUDContainer'

export default store => {
    ReactDOM.render((
            <Provider store={store}>
                <HUD/>
            </Provider>
        ),
        document.getElementById('hud')
    )
}