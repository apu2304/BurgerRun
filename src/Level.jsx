import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react'
import { useGLTF, Text, Float, MeshReflectorMaterial } from '@react-three/drei'
THREE.ColorManagement.legacyMode = false
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floorMaterial = new THREE.MeshStandardMaterial({ color: 'lightgreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const floor3Material = new THREE.MeshStandardMaterial({ color: 'orangered' })
const floor4Material = new THREE.MeshStandardMaterial({ color: 'gold' }) //slategray(optional)

/**
 * A block that starts the level.
 * It is a green box with a size of 4x0.2x4, positioned at the given position.
 */
export function BlockStart({ positon = [0, 0, 0] }) {
    return (
        <group position={positon}>
            <mesh position={[0, -0.1, 0]} receiveShadow
                geometry={boxGeometry} scale={[4, 0.2, 4]}
            >
                <MeshReflectorMaterial color={"#111111"} resolution={512} blur={[300, 100]} // [horizontal blur, vertical blur]
                        mixBlur={1}
                        mixStrength={1}
                        roughness={0.1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        mirror={0} />
            </mesh>
            <Float floatIntensity={0.25} rotationIntensity={0.25}>
                <Text font="/bangers-v20-latin-regular.woff"
                    fontSize={0.3}
                    maxWidth={0.5}
                    lineHeight={1}
                    textAlign='right'
                    position={[0.75, 0.65, 0]}
                    rotation-y={-0.25}
                >
                    Burger Run
                </Text>
            </Float>
        </group>
    )
}
export function BlockEnd({ positon = [0, 0, 0] }) {
    const model = useGLTF("/burger-draco/hamburger-draco-v1.glb")
    model.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })
    return (
        <group position={positon}>
            <mesh position={[0, 0, 0]} receiveShadow
                geometry={boxGeometry} scale={[4, 0.2, 4]}
            >
                <MeshReflectorMaterial color={"#222222"} resolution={512} blur={[300, 100]} // [horizontal blur, vertical blur]
                        mixBlur={1}
                        mixStrength={1}
                        roughness={0.1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        mirror={0} />
            </mesh>
            <Text font="/bangers-v20-latin-regular.woff"
                fontSize={0.6}
                textAlign='center'
                position={[0, 2.25, 2]}
            >
                Finish
                <meshStandardMaterial color="gold" />
            </Text>
            <RigidBody type='fixed' colliders="hull"
                position={[0, 0.25, 0]}
                restitution={0.2} friction={0}
            >

                <primitive object={model.scene} scale={0.25} />
            </RigidBody>
        </group>
    )
}

function Bounds({ length = 1 }) {
    return (
        <>
            <RigidBody type='fixed'
                restitution={0.2} friction={0}>
                <CuboidCollider args={[2, 0.1, 2 * length]}
                    position={[0, -0.1, - (length * 2) + 2]}
                    restitution={0.2} friction={1}
                />
                <mesh position={[2.1, 0.6, -(length * 2) + 2]} receiveShadow
                    geometry={boxGeometry} scale={[0.2, 1.6, length * 4]}
                    castShadow >
                    <MeshReflectorMaterial color={"#887777"} resolution={512} blur={[300, 100]} // [horizontal blur, vertical blur]
                        mixBlur={1}
                        mixStrength={1}
                        roughness={0.1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        mirror={0} />
                </mesh>
                <mesh position={[-2.1, 0.6, -(length * 2) + 2]} receiveShadow
                    geometry={boxGeometry} scale={[0.2, 1.6, length * 4]}
                >
                    <MeshReflectorMaterial color={"#887777"} resolution={512} blur={[300, 100]} // [horizontal blur, vertical blur]
                        mixBlur={1}
                        mixStrength={1}
                        roughness={0.1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        mirror={0} />
                </mesh>
                <mesh position={[0, 0.6, -(length * 4) + 2]} receiveShadow
                    geometry={boxGeometry} scale={[4.4, 1.6, 0.2]} >
                    <MeshReflectorMaterial color={"#887777"} resolution={512} blur={[300, 100]} // [horizontal blur, vertical blur]
                        mixBlur={1}
                        mixStrength={1}
                        roughness={0.1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        mirror={0} />
                </mesh>
            </RigidBody>
        </>
    )
}
export function BlockSpinner({ positon = [0, 0, 0] }) {
    const obsticle = useRef()
    const [speed] = useState(() => (Math.random() * 0.5 + 0.2) * (Math.random() < 0.5 ? -1 : 1))
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const quaternion = new THREE.Quaternion()
        quaternion.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obsticle.current.setNextKinematicRotation(quaternion)
    })
    return (
        <group position={positon}>
            <mesh position={[0, -0.1, 0]} receiveShadow
                geometry={boxGeometry} scale={[4, 0.2, 4]}
            >
                <MeshReflectorMaterial color={"#222222"} resolution={512} blur={[300, 100]} // [horizontal blur, vertical blur]
                        mixBlur={1}
                        mixStrength={1}
                        roughness={0.1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        mirror={0}/>
            </mesh>
            {/* spinning box */}
            <RigidBody type="kinematicPosition" ref={obsticle}
                friction={0} restitution={0.2}
            >
                <mesh position={[0, 0.1, 0]}
                    scale={[3, 0.3, 0.3]} geometry={boxGeometry}
                    material={floor3Material}
                    castShadow receiveShadow
                />
            </RigidBody>
        </group>
    )
}
export function BlockLimbo({ positon = [0, 0, 0] }) {
    const obsticle = useRef()
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const angle = time + timeOffset
        const y = Math.sin(angle) + 1.15
        obsticle.current.setNextKinematicTranslation({ x: positon[0], y: positon[1] + y, z: positon[2] })
    })
    return (
        <group position={positon}>
            <mesh position={[0, -0.1, 0]} receiveShadow
                geometry={boxGeometry} scale={[4, 0.2, 4]}
            >
                <MeshReflectorMaterial color={"#222222"}resolution={512} blur={[300, 100]} // [horizontal blur, vertical blur]
                        mixBlur={1}
                        mixStrength={1}
                        roughness={0.1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        mirror={0} />
            </mesh>
            {/* spinning box */}
            <RigidBody type="kinematicPosition" ref={obsticle}
                friction={0} restitution={0.2}
            >
                <mesh position={[0, 0.1, 0]}
                    scale={[3, 0.3, 0.3]} geometry={boxGeometry}
                    material={floor3Material}
                    castShadow receiveShadow
                />
            </RigidBody>
        </group>
    )
}
export function BlockAxe({ positon = [0, 0, 0] }) {
    const obsticle = useRef()
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const angle = time + timeOffset
        const y = Math.sin(angle)
        obsticle.current.setNextKinematicTranslation({ x: positon[0] + y, y: positon[1] + 0.75, z: positon[2] })
    })
    return (
        <group position={positon}>
            <mesh position={[0, -0.1, 0]} receiveShadow
                geometry={boxGeometry} scale={[4, 0.2, 4]}
            >
                <MeshReflectorMaterial color={"#222222"} resolution={512} blur={[300, 100]} // [horizontal blur, vertical blur]
                        mixBlur={1}
                        mixStrength={1}
                        roughness={0.1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        mirror={0} />
            </mesh>
            {/* spinning box */}
            <RigidBody type="kinematicPosition" ref={obsticle}
                friction={0} restitution={0.2}
            >
                <mesh position={[0, 0.1, 0]}
                    scale={[1.5, 1.5, 0.3]} geometry={boxGeometry}
                    material={floor3Material}
                    castShadow receiveShadow
                />
            </RigidBody>
        </group>
    )
}
const Level = ({ levelLength = 5, types = [BlockSpinner, BlockLimbo, BlockAxe], blockSeed = 0 }) => {
    const Blocks = useMemo(() => {
        const Blocks = []
        for (let i = 0; i < levelLength; i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            Blocks.push(type)
        }
        return Blocks
    }, [levelLength, types, blockSeed])
    return (
        <>
            {/* floor */}
            <BlockStart positon={[0, 0, 0]} />
            {Blocks.map((Block, index) => (
                <Block key={index} positon={[0, 0, -(index + 1) * 4]} />
            ))}
            <BlockEnd positon={[0, 0, -(levelLength + 1) * 4]} />
            <Bounds length={levelLength + 2} />
        </>
    )
}

export default Level
