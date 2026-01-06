import { useFrame } from "@react-three/fiber"
import { RigidBody, useRapier } from "@react-three/rapier"
import { useKeyboardControls } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import useGame from "./store/useGame"
const Player = () => {
    const [sub, get] = useKeyboardControls()
    const player = useRef()
    const { rapier, world } = useRapier()
    const [smoothCameraPositon] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothCameraTarget] = useState(() => new THREE.Vector3())
    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)
    const jump = () => {
        const origin = player.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)
        if (hit.timeOfImpact < 0.15) {
            player.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
        }

    }
    const reset = () => {
        console.log("reset player")
        player.current.setTranslation({ x: 0, y: 1, z: 0 }, true)
        player.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        player.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    }
    useEffect(() => {
        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if (value === "ready") {
                    reset()
                }
            }
        )
        const unsubscribe = sub(
            (state) => state.jump,
            (value) => {
                if (value) {
                    jump()
                }
            }
        )
        const unsubscribeAny = sub(
            () => {
                start()
            }
        )
        return () => {
            unsubscribe()
            unsubscribeAny()
            unsubscribeReset()
        }
    }, [])

    useFrame((state, delta) => {
        //controls
        const { forward, backward, leftward, rightward } = get()
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }
        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.2 * delta
        if (forward) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }
        if (rightward) {
            impulse.x += impulseStrength
            torque.x -= torqueStrength
        }
        if (backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }
        if (leftward) {
            impulse.x -= impulseStrength
            torque.x += torqueStrength
        }

        player.current.applyImpulse(impulse)
        player.current.applyTorqueImpulse(torque)
        //camera
        const playerPosition = player.current.translation()
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(playerPosition)
        cameraPosition.y += 0.65
        cameraPosition.z += 2.25
        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(playerPosition)
        cameraTarget.y += 0.25
        smoothCameraPositon.lerp(cameraPosition, 5 * delta)
        smoothCameraTarget.lerp(cameraTarget, 5 * delta)
        state.camera.position.copy(smoothCameraPositon)
        state.camera.lookAt(smoothCameraTarget)
        //phases end
        if (playerPosition.z < - blocksCount * 4 + 2) {
            end()
        }
        if (playerPosition.y < -4) {
            restart()
        }
    })
    return (
        <>
            <RigidBody colliders="ball" position={[0, 1, 0]}
                canSleep={false}
                linearDamping={0.5}
                restitution={0.2} friction={1}
                ref={player}
            >
                <mesh castShadow>
                    <icosahedronGeometry args={[0.3, 1]} />
                    <meshStandardMaterial flatShading color="mediumpurple" />
                </mesh>
            </RigidBody>
        </>
    )
}

export default Player
