import Species from './species.js';
import Cell from './cell.js';

/**
 * Default settings for new worlds
 */
let defaultSettings = {
    cellSize: 20,
    grid: {
        height: 0,
        width: 0,
        area: 0
    },
    showWireframe: false
};


class World {


    /**
     * Build a new world
     * @param selector - the canvas to build the world in
     * @param settings - optional world settings
     */
    constructor(selector, settings) {
        this.settings = Object.assign(defaultSettings, settings);           // Override default settings with any user-passed ones.
        this.settings.canvas = selector;                                    // Cache our canvas.
        this.settings.context = this.settings.canvas.getContext("2d");      // Set the context of our canvas.
        this.cells = {};                                                    // Create the container for our ce
        this.species = {};
        this.resizeWrapper();                                               // Set the canvas dimensions.
    }


    /**
     * Resize the canvas to its visible size (fixes stretching issues) and update grid size
     */
    resizeWrapper() {
        [this.settings.canvas.width, this.settings.canvas.height] = [                       // Set canvas width and height.
            this.settings.canvas.scrollWidth,
            this.settings.canvas.scrollHeight
        ];

        [this.settings.grid.width, this.settings.grid.height] = [                           // Recalculate grid dimensions.
            Math.ceil(this.settings.canvas.width / this.settings.cellSize),
            Math.ceil(this.settings.canvas.height / this.settings.cellSize)
        ];

        this.settings.grid.area = this.settings.grid.width * this.settings.grid.height;     // Calculate the area of the world.

        this.cells = {};                                                                    // Ensure cell container is empty.
        for(let gridY = 0; gridY <= this.settings.grid.height; gridY++) {                   // Add all grid blocks to cell container.
            for (let gridX = 0; gridX <= this.settings.grid.width; gridX++) {
                this.cells[[gridX, gridY].join()] = {};
            }
        }

        return this;
    }


    /**
     * Register a new species to the new world
     * @param obj
     */
    newSpecies(obj) {
        this.species[obj.name] = new Species(obj);
    }


    /**
     * Register a new species to the new world
     */
    changeCell(cellToChange, newCellType) {
        cellToChange.species = this.species[newCellType];
    }


    /**
     * Loop through each grid block and assign a new cell
     * @param species - settings object for cell
     */
    fillWorld(species) {
        this.loopThroughCells((cell, x, y) => {
            this.cells[cell] = new Cell(this, this.species[species], x, y);
        });

        this.getNeighbors();
    }


    /**
     * Loops through all cells and executes a function on them
     * @param callback - Function to execute, passing along the cell's key and coordinates
     */
    loopThroughCells(callback) {
        for (let cell in this.cells) {
            let cellCoords = cell.split(',');
            callback(cell, Number(cellCoords[0]), Number(cellCoords[1]));
        }
    }


    /**
     * Fill the empty areas with cells
     * @param species - settings object for cell. Defaults to a basic white cell.
     */
    fillGaps(species) {
        this.loopThroughCells((cell, x, y) => {
            if (!(this.cells[cell] instanceof Cell)) {
                this.cells[cell] = new Cell(this, this.species[species], x, y);
            }
        });
        this.getNeighbors();
    }


    /**
     * Randomly place cells
     * @param species - settings object for cell
     * @param num - number of cells to place
     */
    randomizeCells(species, num) {
        let maxGridX = this.settings.grid.width,
            maxGridY = this.settings.grid.height,
            newCells = new Set();

        num = num >= this.settings.grid.area ? this.settings.grid.area : num;                           // Make sure the passed number is not greater than the world size.

        while (newCells.size < num) {                                                                   // Generate designated number of coordinate sets.
            newCells.add([~~(Math.random() * maxGridX), ~~(Math.random() * maxGridY)].join());
        }

        newCells.forEach((entry) => {                                                                   // Make cells at generated coordinates.
            let entryCoords = entry.split(',');
            this.cells[entry] = new Cell(this, this.species[species], entryCoords[0], entryCoords[1]);
        });

        this.getNeighbors();
    }


    /**
     * Update each cells neighborhood
     */
    getNeighbors() {
        this.loopThroughCells((cell, x, y) => {
            this.cells[cell].neighborhood = [];

            for (let i = -1; i <= 1; i++) {
                for (let ii = -1; ii <= 1; ii++) {
                    let coordsX = x + i,
                        coordsY = y + ii;
                    if (between(coordsX, 0, this.settings.grid.width) && between(coordsY, 0, this.settings.grid.height)) {
                        this.cells[cell].neighborhood.push([coordsX, coordsY].join());
                    }
                }
            }
        });

        function between(num, first, last){
            return (first < last ? num >= first && num <= last : num >= last && num <= first);
        }
    }


    /**
     * Start the simulation
     */
    start() {
        //this.render();
        //this.settings.animationProcess = window.requestAnimationFrame.bind(this);
        //this.settings.animationProcess(this.render);
        setInterval(() => {
            this.render();
        }, 20);
    }


    /**
     * Render each frame of the simulation
     */
    render() {
        this.loopThroughCells((cell, x, y) => {
            this.cells[cell].update(this);
        });

        this.settings.context.clearRect(0, 0, this.settings.canvas.width, this.settings.canvas.height);     // Clear the canvas

        this.loopThroughCells((cell, x, y) => {
            this.cells[cell].draw(this);
        });

        this.getNeighbors();
    }


}


export default World;