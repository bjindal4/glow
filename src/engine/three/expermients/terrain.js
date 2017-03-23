import {
    Mesh,
    MeshPhongMaterial,
    PlaneBufferGeometry,
} from 'three'

const geometry = new PlaneBufferGeometry(1600, 1600, 30, 30)
const vertices = geometry.attributes.position.array
for (let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
    vertices[j + 2] = Math.random() * 30
}

const mesh = new Mesh(geometry, new MeshPhongMaterial({
    color:     0x665b43,
    specular:  0xff0000,
    shininess: 10,
    wireframe: false,
}))
mesh.rotateX(-Math.PI * .5)
mesh.position.y    = -10
mesh.castShadow    = true
mesh.receiveShadow = true
