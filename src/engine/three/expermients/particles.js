import img from 'assets/graphics/three/reward.png'
import {
    TextureLoader,
    ShaderMaterial,
    BufferGeometry,
    BufferAttribute,
    AdditiveBlending,
    Color,
    Points,
} from 'three'

const vertexShader = `
    attribute float size;
    attribute vec3  customColor;
    varying   vec3  vColor;
    
    void main() {
        vColor          = customColor;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize    = size * ( 300.0 / -mvPosition.z );
        gl_Position     = projectionMatrix * mvPosition;
    }
`

const fragmentShader = `
    uniform vec3      color;
    uniform sampler2D texture;
    varying vec3      vColor;
    
    void main() {
        gl_FragColor = vec4( color * vColor, 1.0 );
        gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
    }
`

export default scene => {
    const particles = 1000

    const uniforms = {
        color:   { value: new Color( 0xffffff )         },
        texture: { value: new TextureLoader().load(img) },
    }

    const shaderMaterial = new ShaderMaterial( {
        uniforms,
        vertexShader,
        fragmentShader,
        blending:    AdditiveBlending,
        depthTest:   false,
        transparent: true
    })

    const radius = 400

    const geometry = new BufferGeometry()

    const positions = new Float32Array( particles * 3 );
    const colors    = new Float32Array( particles * 3 );
    const sizes     = new Float32Array( particles );
    const color     = new Color()

    for (let i = 0, i3 = 0; i < particles; i ++, i3 += 3) {
        positions[ i3 + 0 ] = ( Math.random() * 2 - 1 ) * radius
        positions[ i3 + 1 ] = ( Math.random() * 2 - 1 ) * radius
        positions[ i3 + 2 ] = ( Math.random() * 2 - 1 ) * radius
        color.setHSL( i / particles, 1.0, 0.5 )
        colors[ i3 + 0 ] = color.r
        colors[ i3 + 1 ] = color.g
        colors[ i3 + 2 ] = color.b
        sizes[ i ] = 20
    }

    geometry.addAttribute('position',    new BufferAttribute(positions, 3))
    geometry.addAttribute('customColor', new BufferAttribute(colors,    3))
    geometry.addAttribute('size',        new BufferAttribute(sizes,     1))

    const particleSystem = new Points(geometry, shaderMaterial)

    scene.add(particleSystem)

    return {
        update(time) {
            const sizes = geometry.attributes.size.array
            for ( var i = 0; i < particles; i++ ) {
                sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time * .05 ) )
            }

            geometry.attributes.size.needsUpdate = true
        }
    }
}
