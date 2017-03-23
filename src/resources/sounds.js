import { Howl }             from 'howler'
import gameLoopSound        from 'assets/sounds/333794__foolboymedia__scary-break-loop.wav'
import explosionSound       from 'assets/sounds/105413__rendensh__explode5.ogg'
import bonusSound           from 'assets/sounds/253172__suntemple__retro-bonus-pickup-sfx.wav'
import clickSound           from 'assets/sounds/233539__waveplay__click.wav'
import confirmSound         from 'assets/sounds/140510__blackstalian__click-sfx8.wav'
import powerUpSound         from 'assets/sounds/220173__gameaudio__spacey-1up-power-up.wav'
import hitSound             from 'assets/sounds/177850__motion-s__hit-modulated-fx.wav'
import gameOverSound        from 'assets/sounds/333785__projectsu012__8-bit-failure-sound.wav'
import rewardSound          from 'assets/sounds/336935__shnur__coin6.wav'
import nightSwitchSound     from 'assets/sounds/321107__nsstudios__robot-or-machine-destroy.wav'
import directionChangeSound from 'assets/sounds/168119__speedenza__whoosh-woow-pt43.wav'
import deathSound           from 'assets/sounds/6720__noisecollector__boom2.wav'
import * as actions         from 'core/actions'

const gameLoop        = new Howl({ src: gameLoopSound,        volume: .4, loop: true })
const reward          = new Howl({ src: rewardSound,          volume: .3 })
const nightShift      = new Howl({ src: nightSwitchSound,     volume: .3 })
const directionChange = new Howl({ src: directionChangeSound, volume: 1  })
const powerUp         = new Howl({ src: powerUpSound,         volume: 1  })
const bonus           = new Howl({ src: bonusSound,           volume: 1  })
const hit             = new Howl({ src: hitSound,             volume: 1 })
const explosion       = new Howl({ src: explosionSound,       volume: 1 })
const death           = new Howl({ src: deathSound,           volume: 1  })
const gameOver        = new Howl({ src: gameOverSound,        volume: 1  })

export default {
    click: new Howl({
        src:    clickSound,
        volume: 1,
    }),
    confirm: new Howl({
        src:    confirmSound,
        volume: .4,
    }),
}

export const fx = {
    [actions.NIGHT_SHIFT_ENABLE]: () => nightShift.play(),
    [actions.GAME_DIRECTION_SET]: () => directionChange.play(),
    [actions.SHOTS_UP]:           () => powerUp.play(),
    [actions.MISSILES_UP]:        () => powerUp.play(),
    [actions.BONUS_PICKUP]:       () => bonus.play(),
    [actions.REWARD_PICKUP]:      () => reward.play(),
    [actions.PLAYER_DEATH]:       () => death.play(),
    [actions.ENEMY_HIT]:          () => hit.play(),
    [actions.SHIP_HIT]:           () => hit.play(),
    [actions.ENEMY_DEATH]:        () => explosion.play(),
    [actions.GAME_START]:         () => {
        gameLoop.volume(.8)
        gameLoop.play()
    },
    [actions.GAME_OVER]:          () => {
        gameLoop.stop()
        gameOver.play()
    },
    [actions.GAME_PAUSE]:         () => {
        gameLoop.volume(.4)
    },
    [actions.GAME_RESUME]:        () => {
        gameLoop.volume(.8)
    },
    [actions.GAME_STOP]:          () => {
        gameLoop.stop()
    },
}