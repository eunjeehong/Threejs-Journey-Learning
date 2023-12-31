import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/Orbitcontrols.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

console.log(dat)

/**
 * Debug
 */
const gui = new dat.GUI()
const parameters = {
    color: 0xff0000,
    spin:() =>
    {
        gsap.to(mesh.rotation, {duration:1, y: mesh.rotation.y+10})
    }
}

gui
.addColor(parameters, 'color')
.onChange(() => {
    material.color.set(parameters.color)
})

gui
    .add(parameters, 'spin')
 
//Cursor
const cursor = {
    x:0,
    y:0
}

window.addEventListener('mousemove', (event)=> {
    cursor.x =  event.clientX / sizes.width -0.5
    cursor.y =  - (event.clientY / sizes.height -0.5)
 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', ()=>
{
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update Camera
    camera.aspect = sizes.width/ sizes.height
    camera.updateProjectionMatrix()

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    if(!document.fullscreenElement)
    {
        canvas.requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
})

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxBufferGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:parameters.color})
const mesh = new THREE.Mesh(geometry, material)
/*
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
*/
scene.add(mesh)

//Debug
gui
.add(mesh.position, 'y')
.min(-3)
.max(3)
.step(0.01)
.name('elevation')

gui
.add(mesh,'visible')

gui
.add(mesh.material,'wireframe')

 

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()