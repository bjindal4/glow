import _              from 'lodash'
import { MAX_HEALTH } from 'core/constants'
import config         from '../../config'

export default () => {
    const container = document.createElement('div')
    container.className = 'hud'

    const main = document.createElement('div')
    main.className = 'hud__main'
    container.appendChild(main)

    const scoreContainer = document.createElement('div')
    scoreContainer.className = 'hud__score'
    main.appendChild(scoreContainer)

    const scoreLabel = document.createElement('span')
    scoreLabel.textContent = 'score'
    scoreContainer.appendChild(scoreLabel)

    const scoreElement = document.createElement('span')
    scoreElement.textContent = '0'
    scoreContainer.appendChild(scoreElement)

    const healthLabel = document.createElement('div')
    healthLabel.textContent = 'health'
    healthLabel.className = 'hud__health__label'
    main.appendChild(healthLabel)

    const healthBar = document.createElement('div')
    healthBar.className = 'hud__health__bar'
    main.appendChild(healthBar)

    const healthBarInner = document.createElement('div')
    healthBarInner.className = 'hud__health__bar__inner'
    healthBar.appendChild(healthBarInner)

    const livesElement = document.createElement('div')
    livesElement.className = 'hud__lives'
    main.appendChild(livesElement)

    const livesLabel = document.createElement('span')
    livesLabel.textContent = 'lives'
    livesElement.appendChild(livesLabel)

    const livesItemsWrapper = document.createElement('div')
    livesItemsWrapper.className = 'hud__lives__items'
    livesElement.appendChild(livesItemsWrapper)

    const livesItems = _.range(6).map(() => {
        const item = document.createElement('span')
        item.className = 'hud__lives__item'
        livesItemsWrapper.appendChild(item)

        return item
    })

    const indicators = document.createElement('div')
    indicators.className = 'hud__indicators'
    container.appendChild(indicators)

    const shotsIndicatorLabel = document.createElement('div')
    shotsIndicatorLabel.className = 'hud__indicators__shots__label'
    shotsIndicatorLabel.textContent = 'shooting level'
    indicators.appendChild(shotsIndicatorLabel)

    const shotsIndicator = document.createElement('div')
    shotsIndicator.className = 'hud__indicators__shots'
    indicators.appendChild(shotsIndicator)

    const shotsItemWidth = 260 / config.weapons.shots.length
    const shotsItems     = _.range(config.weapons.shots.length).map(() => {
        const item = document.createElement('span')
        item.style.width = `${shotsItemWidth}px`
        item.className = 'hud__indicators__shots__item'
        shotsIndicator.appendChild(item)

        return item
    })

    const missilesIndicatorLabel = document.createElement('div')
    missilesIndicatorLabel.className = 'hud__indicators__missiles__label'
    missilesIndicatorLabel.textContent = 'missiles level'
    indicators.appendChild(missilesIndicatorLabel)

    const missilesIndicator = document.createElement('div')
    missilesIndicator.className = 'hud__indicators__missiles'
    indicators.appendChild(missilesIndicator)

    const missilesItemWidth = 260 / config.weapons.missiles.length
    const missilesItems     = _.range(config.weapons.missiles.length).map(() => {
        const item = document.createElement('span')
        item.style.width = `${missilesItemWidth}px`
        item.className = 'hud__indicators__missiles__item'
        missilesIndicator.appendChild(item)

        return item
    })

    const iconIndicators = document.createElement('div')
    iconIndicators.className = 'hud__indicators__icons'
    indicators.appendChild(iconIndicators)

    const nightIndicator = document.createElement('span')
    nightIndicator.className = 'hud__indicators__night'
    iconIndicators.appendChild(nightIndicator)

    const shieldIndicator = document.createElement('span')
    shieldIndicator.className = 'hud__indicators__shield'
    iconIndicators.appendChild(shieldIndicator)

    return {
        update: ({
            score,
            health,
            lives,
            shotsLevel,
            missilesLevel,
            shieldIsEnabled,
            nightIsEnabled,
        }) => {
            scoreElement.textContent = `${score}`
            //livesElement.textContent = `lives: ${lives}`

            livesItems.forEach((e, i) => {
                e.className = `hud__lives__item${i < lives ? ' _is-active' : ''}`
            })

            healthBarInner.style.width = `${Math.max(0, health / MAX_HEALTH * 260)}px`

            nightIndicator.className  = `hud__indicators__night${nightIsEnabled ? ' _is-active' : ''}`
            shieldIndicator.className = `hud__indicators__shield${shieldIsEnabled ? ' _is-active' : ''}`

            shotsItems.forEach((e, i) => {
                if (i < shotsLevel) {
                    e.className = 'hud__indicators__shots__item--active'
                } else {
                    e.className = 'hud__indicators__shots__item'
                }
            })

            missilesItems.forEach((e, i) => {
                if (i < missilesLevel) {
                    e.className = 'hud__indicators__missiles__item--active'
                } else {
                    e.className = 'hud__indicators__missiles__item'
                }
            })
        },
        getDom: () => container
    }
}