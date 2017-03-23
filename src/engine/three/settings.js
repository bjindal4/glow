export const QUALITY_CRAZY  =  2
export const QUALITY_HIGH   =  1
export const QUALITY_MEDIUM =  0
export const QUALITY_LOW    = -1
export const QUALITY_CRAPPY = -2

const CURRENT_QUALITY   = QUALITY_MEDIUM
const CAMERA_FOV        = 65
const INFLUENCE_CAMERA  = true
const ENVIRONMENT_SPEED = 18
const GROUND_OFFSET     = 80
const TUBE_RADIUS       = 800
const TUBE_ANGLE        = Math.PI * .6
const FOG_COLOR         = '#201840'
const ARENA_WIDTH       = 1000
const ARENA_HEIGHT      = 1200

const settingsByQuality = {
    [QUALITY_CRAZY]: {
        shadowMapSize: 2048,
        antialiasing:  true,
        pixelRatio:    1.5,
        castShadows:   true,
    },
    [QUALITY_HIGH]: {
        shadowMapSize: 2048,
        antialiasing:  true,
        pixelRatio:    1.2,
        castShadows:   true,
    },
    [QUALITY_MEDIUM]: {
        shadowMapSize: 1024,
        antialiasing:  false,
        pixelRatio:    1,
        castShadows:   true,
    },
    [QUALITY_LOW]: {
        shadowMapSize: 512,
        antialiasing:  false,
        pixelRatio:    1,
        castShadows:   true,
    },
    [QUALITY_CRAPPY]: {
        shadowMapSize: 512,
        antialiasing:  false,
        pixelRatio:    .6,
        castShadows:   false,
    },
}

export default {
    ...settingsByQuality[CURRENT_QUALITY],
    quality:         CURRENT_QUALITY,
    influenceCamera: INFLUENCE_CAMERA,
    groundOffset:    GROUND_OFFSET,
    envSpeed:        ENVIRONMENT_SPEED,
    tubeRadius:      TUBE_RADIUS,
    tubeAngle:       TUBE_ANGLE,
    fogColor:        FOG_COLOR,
    arenaWidth:      ARENA_WIDTH,
    arenaHeight:     ARENA_HEIGHT,
    camera:          {
        fov: CAMERA_FOV,
        top: {
            x: 0,
            y: 900,
            z: 700,
        },
        front: {
            x: 0,
            y: 500,
            z: 800,
        },
    },
}