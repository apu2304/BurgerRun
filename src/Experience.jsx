import { useControls } from "leva"
import { Perf } from "r3f-perf"
import Lights from "./Lights"
import Level from "./Level"
import { Physics } from "@react-three/rapier"
import Player from "./Player"
import useGame from "./store/useGame"
import Effects from "./Effect"
const Experience = () => {
    // const { perfVisible } = useControls({
    //     perfVisible: true
    // })
   const blocksCount = useGame((state) => state.blocksCount)
   const blockSeed = useGame((state) => state.blockSeed)
//    console.log("blocksCount:", blocksCount)
    return (
        <>
            {/* {perfVisible && <Perf position="top-left" />} */}
            <Physics 
            //debug
            >
                <Lights />
                <Level levelLength={blocksCount} blockSeed={blockSeed} />
                <Player />
            </Physics>
            <Effects />
        </>
    )
}

export default Experience