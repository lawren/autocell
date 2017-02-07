import World from './world.js';


const CA = {

    /**
     * Creates a new world in the specified canvas
     * @param selector
     */
    newWorld: (...settings) => new World(...settings),

}


export default CA;