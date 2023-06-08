export default class TileMap {
    constructor(tileSize){
        this.tileSize = tileSize;
        this.grass = this.#image("Grass.png");
    }
     
    #image(fileName) {
        const img = new Image();
        img.src = `images/${fileName}`;
        return img
    }

    //1 - grass
    //2 - stone-path
    //3 - tree

    map = [
        [1,1,1,1,1,1,1,1,1,1,1,],
        [1,2,2,2,2,2,2,2,2,2,1,],
        [1,1,1,1,1,1,1,1,1,1,1,],
        [1,1,1,1,1,1,1,1,1,1,1,],
        [1,1,1,1,1,1,1,1,1,1,1,],
        [1,1,1,1,1,1,1,1,1,1,1,],
    ]




















    draw(canvas, ctx) {
        this.#setCanvasSize(canvas);
        this.#clearCanvas(canvas,ctx);
        this.#drawMap(ctx);
    }

    #drawMap(ctx){
        for(let row = 0; row< this.map.length; row++) {
            for(let column = 0; column <globalThis.map[row].length; column++) {
                const tile = this.map[row][column];
                let image = null;
                switch (tile) {
                    case 1:
                        image = this.grass;
                        break;
                        
                }

                if(image != null)
                    ctx.drawImage(image,column * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize)

            }
        }
    }

    #clearCanvas(canvas,ctx){
        ctx.filStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    #setCanvasSize(canvas){
        canvas.height = this.map.length * this.tileSize;
        canvas.width = this.map[0].length * this.tileSize;
    }
}

