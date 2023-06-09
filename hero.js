export default class Hero {
    constructor(x, y, tileSize, velocity, tileMap) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileMap = tileMap;
        this.#loadHeroImage();
        this.deafultVelocity = this.velocity;
    }

    // === HERO CREATION ===

    draw(ctx) {
        let visibleHeight = this.tileSize;
        let offsetY = 0;
        let sx = 0;
        let sy = 0;
        let swidth = 64;
        let sheight = 64;
        let rowCurrent = Math.round(this.y / this.tileSize);
        let columnCurrent = Math.round(this.x / this.tileSize);

        if (this.tileMap.layer1[rowCurrent][columnCurrent] === 5) {
            sheight = (64) * 0.7;
            visibleHeight = this.tileSize * 0.7;
        }

        ctx.drawImage(this.HeroImages[this.HeroImageIndex], sx, sy, swidth, sheight, this.x, this.y - offsetY, this.tileSize, visibleHeight);
    }

    #loadHeroImage() {
        let HeroImage1 = new Image();
        let HeroImage2 = new Image();
        let HeroImage3 = new Image();
        let HeroImage4 = new Image();
        HeroImage1.src = "./images/hiker01.png";
        HeroImage2.src = "./images/hiker02.png";
        HeroImage3.src = "./images/hiker03.png";
        HeroImage4.src = "./images/hiker04.png";
        this.HeroImages = [HeroImage1, HeroImage2, HeroImage3, HeroImage4];
        this.HeroImageIndex = 0;
    };

    // === MOVEMENT ===

    moveUp() {
        this.checkIfSolid();

        if (this.isSolidAbove == false) {
            this.y -= (this.tileSize * this.velocity) / this.tileSize;
            this.HeroImageIndex = 0;
        }
    }

    moveDown() {
        this.checkIfSolid();
        if (this.isSolidBelow == false) {
            this.y += (this.tileSize * this.velocity) / this.tileSize;
            this.HeroImageIndex = 3;
        }
    }

    moveRight() {
        this.checkIfSolid()
        if (this.isSolidRight == false) {
            this.x += (this.tileSize * this.velocity) / this.tileSize;
            this.HeroImageIndex = 1;
        }
    }

    moveLeft() {
        this.checkIfSolid()
        if (this.isSolidLeft == false) {
            this.x -= (this.tileSize * this.velocity) / this.tileSize;
            this.HeroImageIndex = 2;
        }
    }

    // === COLISSION ===

    checkIfSolid() {

        this.isSolidAbove = false;
        this.isSolidBelow = false;
        this.isSolidRight = false;
        this.isSolidLeft = false;

        const rowAbove = Math.ceil(this.y / this.tileSize) - 1;
        const rowBelow = Math.floor(this.y / this.tileSize) + 1;
        const columnRight = Math.ceil(this.x / this.tileSize);
        const columnLeft = Math.floor(this.x / this.tileSize);

        const rowCurrent = Math.round(this.y / this.tileSize);
        const columnCurrent = Math.round(this.x / this.tileSize);


        this.mapHeight = this.tileMap.layer1.length;
        this.mapWidth = this.tileMap.layer1[1].length;

        const solidTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
        //add current row and column variables for readability

        if (rowAbove < 0) {
            this.isSolidAbove = true;
        } else {
            if (solidTiles.includes(
                this.tileMap.heroLayer[rowAbove][columnCurrent])
            ) {
                this.isSolidAbove = true;
            }
        }

        if (rowBelow >= this.mapHeight) {
            this.isSolidBelow = true;
        } else {
            if (
                solidTiles.includes(this.tileMap.heroLayer[rowBelow][columnCurrent])
            ) {
                this.isSolidBelow = true;
            }
        }

        if (columnRight >= this.mapWidth || rowCurrent > this.mapHeight) {
            this.isSolidRight = true;
        } else {
            if (this.tileMap.heroLayer[rowCurrent] &&
                (solidTiles.includes(this.tileMap.heroLayer[rowCurrent][columnRight]))
            ) {
                this.isSolidRight = true;
            }
        }

        if (columnLeft < 0 || rowCurrent > this.mapHeight) {
            this.isSolidLeft = true;
        } else {
            if (
                this.tileMap.heroLayer[rowCurrent] &&
                (solidTiles.includes(this.tileMap.heroLayer[rowCurrent][columnLeft]))
            ) {
                this.isSolidLeft = true;
            }
        }
    };

    findCollision() {
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

    // === WIN CONDITION ===

    winCondition() {
        const winEvent = new CustomEvent('winEvent', { detail: { message: 'You won' } });
        if (this.tileMap.heroLayer[Math.round(this.y / this.tileSize)][Math.round(this.x / this.tileSize)] === 98) {
            document.dispatchEvent(winEvent);
        }
    }

    // === SURFACE BEHAVIOUR LOGIC ===

    surfaceBehaviour() {

        //SURFACES

        let updatedVelocity;
        let rowCurrent = Math.round(this.y / this.tileSize);
        let columnCurrent = Math.round(this.x / this.tileSize);

        if ([1, 2, 3, 4, 5, 6].includes(this.tileMap.layer2[Math.round(this.y / this.tileSize)][Math.round(this.x / this.tileSize)])) {
            updatedVelocity = this.deafultVelocity;
        } else if ([7, 8, 9, 10, 11, 12].includes(this.tileMap.layer2[Math.round(this.y / this.tileSize)][Math.round(this.x / this.tileSize)])) {
            updatedVelocity = this.deafultVelocity * 0.7;
        } else {
            updatedVelocity = this.deafultVelocity * 0.5;
        }

        // === WATER ===

        if (this.tileMap.layer1[rowCurrent][columnCurrent] === 5 && rowCurrent >= 0 && rowCurrent < this.mapHeight - 1) {

            updatedVelocity = this.deafultVelocity * 0.2;


            if (
                rowCurrent < this.tileMap.layer1.length &&
                columnCurrent + 1 < this.tileMap.layer1[0].length &&
                this.tileMap.layer1[rowCurrent + 1][columnCurrent] === 5
            ) {
                this.y += ((this.tileSize * this.velocity * 0.5) / this.tileSize);
            }

            if (this.tileMap.layer1[rowCurrent][columnCurrent + 1] === 5) {
                this.x += (this.tileSize * this.velocity * 0.5) / this.tileSize;
            }

            if (this.tileMap.layer1[rowCurrent][columnCurrent - 1] === 5) {
                this.x -= (this.tileSize * this.velocity * 0.5) / this.tileSize;
            }

            if (this.tileMap.layer1[rowCurrent][columnCurrent + 1] === 5 && this.tileMap.layer1[rowCurrent][Math.round(this.x / this.tileSize) - 1] === 5) {
                this.x += (this.tileSize * this.velocity * 0.5) / this.tileSize;
            }
        }
        this.velocity = updatedVelocity;
    }

    // === UNCOVERING TILES ===

    uncoverTile() {
        const rowCurrent = Math.round(this.y / this.tileSize);
        const columnCurrent = Math.round(this.x / this.tileSize);

        const tilesToUpdate = [
            [rowCurrent, columnCurrent],
            [rowCurrent + 1, columnCurrent + 1],
            [rowCurrent - 1, columnCurrent - 1],
            [rowCurrent + 1, columnCurrent],
            [rowCurrent, columnCurrent + 1],
            [rowCurrent - 1, columnCurrent],
            [rowCurrent, columnCurrent - 1],
            [rowCurrent - 1, columnCurrent + 1],
            [rowCurrent + 1, columnCurrent - 1]
        ];

        for (const [row, column] of tilesToUpdate) {
            if (
                row >= 0 &&
                row < this.tileMap.coverLayer.length &&
                column >= 0 &&
                column < this.tileMap.coverLayer[row].length
            ) {
                this.tileMap.coverLayer[row][column] = 0;
            }
        }
    }

    findStartPosition() {
        for (let row = 0; row < this.tileMap.heroLayer.length; row++) {
            for (let column = 0; column < this.tileMap.heroLayer[row].length; column++) {
                let tile = this.tileMap.heroLayer[row][column];
                if (tile === 99) {
                    this.x = column * this.tileSize;
                    this.y = row * this.tileSize;
                }
            }
        }

    }
}

