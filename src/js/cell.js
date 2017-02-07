class Cell {

    constructor(world, species, gridX, gridY) {
        this.size = world.settings.cellSize;
        this.location = {
            gridX: gridX,
            gridY: gridY,
            canvasX: gridX * this.size,
            canvasY: gridY * this.size
        };
        this.species = species;
        this.neighborhood = [];
        this.draw(world);
    }

    draw(world) {
        world.settings.context.fillStyle = this.species.color;
        world.settings.context.fillRect(this.location.canvasX, this.location.canvasY, this.size, this.size);
        if (world.settings.showWireframe) {
            world.settings.context.strokeRect(this.location.canvasX, this.location.canvasY, this.size, this.size);
        }
    }

    update() {
        this.species.process(this);
    }


}


export default Cell;