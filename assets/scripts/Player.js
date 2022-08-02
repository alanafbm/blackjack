export default class Player {
    constructor(index){
        this.id = index + 1;
        this.points = 0;
        this.isPlaying = true;
        this.hasFinished = false;
    }
}