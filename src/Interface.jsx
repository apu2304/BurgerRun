import { useKeyboardControls } from "@react-three/drei"
import useGame from "./store/useGame"
import { use, useEffect, useRef } from "react"
import { addEffect } from "@react-three/fiber"
const Interface = () => {
    const time = useRef()
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)
    useEffect(() => {
        const unsubscribe = addEffect(() => {
            const state = useGame.getState()
            let elapsedTime = 0
            if (state.phase === "playing") {
                elapsedTime = Date.now() - state.startTime
            } else if (state.phase === "ended") {
                elapsedTime = state.endTime - state.startTime
            }
            elapsedTime/= 1000
            elapsedTime = elapsedTime.toFixed(2)
            if (time.current) {
                time.current.textContent = `Time: ${elapsedTime}`
            }
        })
        return () => {
            unsubscribe()
        }
    } , [])
    return (
        <div className="fixed top-0 left-0 w-full pointer-events-none 
          font-display">
            {/* time */}
            <div ref={time}
            className="absolute top-8 left-0 w-full text-white 
             text-[4vh] bg-blue-950/50 pt-1 text-center ">
                Time: 00:00
            </div>
           { phase === "ended" && (
               <div onClick={restart}
                className="flex justify-center items-center 
             absolute top-48 left-0 w-full text-white text-6xl
              bg-blue-950/50 pt-1 pointer-events-auto cursor-pointer">
                Restart
            </div>
           )}
            {/* controls */}
            <div className="absolute top-80 left-0 w-full">
                <div className=" flex justify-center">
                    <div className={`w-10 h-10 m-1  ${forward ? "bg-white/40" : ""}
                    border-2 border-white bg-blue-950/25`}></div>
                </div>
                <div className=" flex justify-center">
                    <div className={`w-10 h-10 m-1  ${leftward ? "bg-white/40" : ""}
                    border-2 border-white bg-blue-950/25`}></div>
                    <div className={`w-10 h-10 m-1  ${backward ? "bg-white/40" : ""}
                    border-2 border-white bg-blue-950/25`}></div>
                    <div className={`w-10 h-10 m-1  ${rightward ? "bg-white/40" : ""}
                    border-2 border-white bg-blue-950/25`}></div>
                </div>
                <div className=" flex justify-center">
                    <div className={`w-36 h-10 m-1 ${jump ? "bg-white/40" : ""}
                    border-2 border-white bg-blue-950/25`}></div>
                </div>
            </div>
        </div>
    )
}

export default Interface
