import CA from './js/cellular-automata.js';

(function(window){

    let myWorld = CA.newWorld( document.getElementsByTagName('canvas')[0], {showWireframe: false, cellSize: 15} );

    myWorld.newSpecies({
        name: 'alive',
        color: 'black',
        process: (thisCell) => {
            let aliveCount = -1;
            for (let neighbor of thisCell.neighborhood) {
                if (myWorld.cells[neighbor].species.name === 'alive') {
                    aliveCount += 1;
                }
            }
            if (aliveCount > 3 || aliveCount < 2) {
                myWorld.changeCell(thisCell, 'dead');
            }
        }
    });

    myWorld.newSpecies({
        name: 'dead',
        color: 'white',
        process: (thisCell) => {
            let aliveCount = 0;
            for (let neighbor of thisCell.neighborhood) {
                if (myWorld.cells[neighbor].species.name === 'alive') {
                    aliveCount += 1;
                }
            }
            if (aliveCount === 3) {
                myWorld.changeCell(thisCell, 'alive');
            }
        }
    });

    myWorld.randomizeCells('alive', 1000);
    myWorld.fillGaps('dead');
    myWorld.getNeighbors();
    myWorld.start();

})(window, undefined);