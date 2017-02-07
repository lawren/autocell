class Species {

    constructor(obj) {
        this.name = obj.name || 'Unknown Species';
        this.color = obj.color || 'black';
        this.process = obj.process || undefined;
    }

}


export default Species;