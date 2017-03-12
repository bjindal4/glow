import Victor from 'victor'

export default class Attraction {
    constructor(subject, options = {
        maxDistance:    300,
        resultingSpeed: 3,
    }) {
        this.subject        = subject
        this.maxDistance    = options.maxDistance
        this.resultingSpeed = options.resultingSpeed
    }

    compute(attractors) {
        const subject        = this.subject
        const maxDistance    = this.maxDistance
        const resultingSpeed = this.resultingSpeed

        // filter with dumb distance checking to avoid unecessary computations
        const eligibles = attractors
            .filter(attractor => {
                return Math.abs(attractor.x - subject.x) < maxDistance &&
                       Math.abs(attractor.y - subject.y) < maxDistance
            })

        if (eligibles.length === 0) return

        const posVec = new Victor(subject.x, subject.y)

        let nearestDistance = maxDistance
        let nearest         = null

        eligibles.forEach(attractor => {
            const dist = posVec.distance(Victor.fromObject(attractor))
            if (dist < nearestDistance) {
                nearestDistance = dist
                nearest         = attractor
            }
        })

        if (!nearest) return

        const nearestVec   = new Victor(nearest.x, nearest.y)
        const deltaVec     = nearestVec.subtract(posVec).norm()
        const attractRatio = nearestDistance / maxDistance

        const finalVec = (new Victor(subject.vx, subject.vy))
            .norm()
            .mix(deltaVec, attractRatio)
            .multiply(new Victor(resultingSpeed, resultingSpeed))

        subject.vx = finalVec.x
        subject.vy = finalVec.y
    }
}