export default class Hero {
    constructor(x, y, tileSize, velocity, tileMap){
        this.x = x;
        this. y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;
        this.#loadHeroImage();
        this.deafultVelocity = this.velocity;
    }


// HERO CREATION

    draw(ctx){
        let visibleHeight = this.tileSize;
        let offsetY = 0;
        let sx = 0;
        let sy = 0;
        let swidth = this.tileSize;
        let sheight = this.tileSize;
        //drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
        ctx.drawImage(this.HeroImages[this.HeroImageIndex], sx, sy, swidth, sheight,this.x, this.y- offsetY, this.tileSize, visibleHeight);
    }

    #loadHeroImage() {
        let HeroImage1 = new Image();
        HeroImage1.src = "./images/pacman.png";
        this.HeroImages = [HeroImage1];
        this.HeroImageIndex = 0;
    };

// MOVEMENT

    moveUp() {
        this.checkIfSolid()
        if (this.isSolidAbove == false){
        this.y -= (this.tileSize*this.velocity)/this.tileSize;
        }
    }

    moveDown() {
        this.checkIfSolid()
        if (this.isSolidBelow == false){
        this.y += (this.tileSize*this.velocity)/this.tileSize;
        }
    }

    moveRight() {
        this.checkIfSolid()
        if (this.isSolidRight == false){
        this.x += (this.tileSize*this.velocity)/this.tileSize;
        }
    }

    moveLeft() {
        this.checkIfSolid()
        if (this.isSolidLeft == false){
        this.x -= (this.tileSize*this.velocity)/this.tileSize;
        }
    }

    // COLISSION

    checkIfSolid() {
        // let collisionCoordinates = this.findCollision();
        
        this.isSolidAbove = false;
        this.isSolidBelow = false;
        this.isSolidRight = false;
        this.isSolidLeft = false;

        const rowAbove = Math.ceil(this.y/this.tileSize)-1;
        const rowBelow = Math.floor(this.y/this.tileSize)+1;
        const columnRight = Math.ceil(this.x/this.tileSize)+1;
        const columnLeft = Math.floor(this.x/this.tileSize);


        const mapHeight = this.tileMap.layer1.length;
        const mapWidth = this.tileMap.layer1[1].length;

        if (rowAbove < 0) {
            this.isSolidAbove = true;
            } 
            else {
            if (this.tileMap.heroLayer[rowAbove][Math.ceil(this.x/this.tileSize)] === 4 || this.tileMap.heroLayer[rowAbove][Math.floor(this.x/this.tileSize)] === 4) {
            this.isSolidAbove = true;
              }
            }
            
        
        if (rowBelow > mapHeight - 1) {
            this.isSolidBelow = true;
            } else {
            if (this.tileMap.heroLayer[rowBelow][Math.ceil(this.x/this.tileSize)] === 4 || this.tileMap.heroLayer[rowBelow][Math.floor(this.x/this.tileSize)] === 4) {
            this.isSolidBelow = true;
              }
            }

        if (columnRight > mapWidth) {
            this.isSolidRight = true;
        } else {
        
        if (this.tileMap.heroLayer[Math.ceil(this.y/this.tileSize)][columnRight-1] === 4 || this.tileMap.heroLayer[Math.floor(this.y/this.tileSize)][columnRight-1] === 4 ){
            this.isSolidRight = true;
            }
        }

        if (columnLeft < 0) {
            this.isSolidLeft = true;
        } else {
        if (this.tileMap.heroLayer[Math.ceil(this.y/this.tileSize)][columnLeft] === 4 || this.tileMap.heroLayer[Math.floor(this.y/this.tileSize)][columnLeft] === 4){
            this.isSolidLeft = true;
            }
        }
       
        // LOG FOR DEBUGGING
            
        console.log(
            "above:"+this.isSolidAbove,
            "below:" + this.isSolidBelow,
            "right:" + this.isSolidRight,
            "left:" + this.isSolidLeft,
            "map-height:" + (this.mapHeight),
            "map-width:" + (this.mapWidth)
            )
            console.log("colission object coordinates:"+ JSON.stringify(this.findCollision()));
            console.log("row: " + Math.ceil(this.y/this.tileSize) + " column: " + Math.floor(this.x/this.tileSize))
            console.log("x:" + this.x, "y:" + this.y);
            console.log(rowBelow+1);
        };

    findCollision(){
            const collisionCoordinates = [];
    
            for (let row = 0; row < this.tileMap.heroLayer.length; row++) {
              for (let column = 0; column < this.tileMap.heroLayer[row].length; column++) {
                const tile = this.tileMap.heroLayer[row][column];
                if (tile === 4) {
                  collisionCoordinates.push({ x: column, y: row });
                }
              }
            }
            return collisionCoordinates;
          };
    
    // WIN CONDITION

    winCondition() {
        if (this.tileMap.heroLayer[Math.floor(this.y/this.tileSize)][Math.ceil(this.x/this.tileSize)] === 6){
            console.log("WIN!!!");
        }
    }

    // SURFACE BEHAVIOUR

        surfaceBehaviour() {
            //WATER
            // console.log(this.tileMap.layer1[Math.floor(this.y/this.tileSize)][Math.ceil(this.x/this.tileSize)] === 3);
            // console.log(this.tileMap.layer1[Math.floor(this.y/this.tileSize)+1][Math.floor(this.x/this.tileSize)]);
            
            if (this.tileMap.layer1[Math.floor(this.y/this.tileSize)][Math.ceil(this.x/this.tileSize)] === 3){
                this.visibleHeight = 16;

                if(this.tileMap.layer1[Math.ceil(this.y/this.tileSize)+1][Math.ceil(this.x/this.tileSize)] === 3){
                this.y += (this.tileSize*this.velocity*0.2)/this.tileSize;
                }

                if(this.tileMap.layer1[Math.floor(this.y/this.tileSize)][Math.ceil(this.x/this.tileSize)+1] === 3){
                    this.x += (this.tileSize*this.velocity*0.2)/this.tileSize;
                }

                if(this.tileMap.layer1[Math.floor(this.y/this.tileSize)][Math.ceil(this.x/this.tileSize)-1] === 3){
                    this.x -= (this.tileSize*this.velocity*0.2)/this.tileSize;
                }

                if(this.tileMap.layer1[Math.floor(this.y/this.tileSize)][Math.ceil(this.x/this.tileSize)+1] === 3 && this.tileMap.layer1[Math.floor(this.y/this.tileSize)][Math.ceil(this.x/this.tileSize)-1] === 3){
                    this.x += (this.tileSize*this.velocity*0.2)/this.tileSize;
                }
            }   

        //SURFACES
        
        let updatedVelocity;

        if (this.tileMap.layer2[Math.floor(this.y / this.tileSize)][Math.floor(this.x / this.tileSize)] === 2 || this.tileMap.layer2[Math.ceil(this.y / this.tileSize)][Math.ceil(this.x / this.tileSize)] === 2) {
            updatedVelocity = this.deafultVelocity;
          }   else {
            updatedVelocity = this.deafultVelocity*0.5;
          }

          this.velocity = updatedVelocity;

        console.log(this.tileMap.layer2[Math.ceil(this.y / this.tileSize)][Math.ceil(this.x / this.tileSize)])
        }

        //UNCOVERING TILES

        uncoverTile() {
            let rowCurrent = Math.floor(this.y/this.tileSize);
            let columnCurrent = Math.floor(this.x/this.tileSize);

            for (let row = 0; row < this.tileMap.coverLayer.length; row++) {
                for (let column = 0; column < this.tileMap.coverLayer[row].length; column++) {
                    this.tileMap.coverLayer[rowCurrent][columnCurrent] =
                    this.tileMap.coverLayer[rowCurrent+1][columnCurrent+1] =
                    this.tileMap.coverLayer[rowCurrent-1][columnCurrent-1] =
                    this.tileMap.coverLayer[rowCurrent+1][columnCurrent] =
                    this.tileMap.coverLayer[rowCurrent][columnCurrent+1] =
                    this.tileMap.coverLayer[rowCurrent-1][columnCurrent] =
                    this.tileMap.coverLayer[rowCurrent][columnCurrent-1] =
                    this.tileMap.coverLayer[rowCurrent-1][columnCurrent+1] =
                    this.tileMap.coverLayer[rowCurrent+1][columnCurrent-1] = 0
                        
                }
        }

    }

}