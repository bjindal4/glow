import { Howl }         from 'howler'
import loopSound        from './assets/sounds/98740__elder-imp__impe-loop-japan.mp3'
import pausedSound      from './assets/sounds/371148__mrthenoronha__cool-game-theme-loop.wav'
import explosionSound   from './assets/sounds/363173__runningmind__pickups-armor-chest.wav'
import bonusSound       from './assets/sounds/253172__suntemple__retro-bonus-pickup-sfx.wav'
import clickSound       from './assets/sounds/233539__waveplay__click.wav'
import confirmSound     from './assets/sounds/140510__blackstalian__click-sfx8.wav'
import powerUpSound     from './assets/sounds/220173__gameaudio__spacey-1up-power-up.wav'
import shipHitSound     from './assets/sounds/143609__d-w__weapons-synth-blast-03.wav'
import playerDeathSound from './assets/sounds/259962__thehorriblejoke__8-bit-explosion.wav'

export default {
    loop: new Howl({
        src:    loopSound,
        volume: .6,
        loop:   true,
    }),
    paused: new Howl({
        src:    pausedSound,
        volume: 1,
        loop:   true,
    }),
    explosion: new Howl({
        src:    explosionSound,
        volume: .2,
    }),
    bonus: new Howl({
        src: bonusSound,
    }),
    click: new Howl({
        src: clickSound,
    }),
    confirm: new Howl({
        src:    confirmSound,
        volume: .4,
    }),
    powerUp: new Howl({
        src: powerUpSound,
    }),
    shipHit: new Howl({
        src:    explosionSound,
        volume: .6,
    }),
    playerDeath: new Howl({
        src:    playerDeathSound,
        volume: .8,
    }),
}
