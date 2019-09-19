function updateScore(score) {
    document.getElementById("score").innerHTML = score;
}

function updateLives(lives) {
    const livesContainer = document.getElementById("lives");
    livesContainer.innerHTML = '';

    for (let i = 0; i < lives; i++) {
        var x = document.createElement("IMG");
        x.src = "heart.png";
        livesContainer.appendChild(x)
    }
}

function hideStart() {
    var end = document.getElementsByClassName("gameStartMainPage")[0];
    var endHidden = end.style.display = "none";
}
function showStart() {
    var end = document.getElementsByClassName("gameStartMainPage")[0];
    var endHidden = end.style.display = "flex";
}
function hideEnd() {
    var end = document.getElementsByClassName("endGameThirdPage")[0];
    var endHidden = end.style.display = "none";
}

function showEnd() {
    var end = document.getElementsByClassName("endGameThirdPage")[0];
    var endHidden = end.style.display = "flex";
}



var increase = 30;


class Player {
    constructor(context) {
        this.x = 50;
        this.startY = 300;
        this.y = 0;
        this.height = 110;
        this.width = 110;
        this.image = new Image();
        this.image.src = "orangeMonster.png";
    }

    //update every frame (every 20 milisec) for bounce
    update(time) {
        this.y = this.startY + 8 * Math.sin(2 * Math.PI * time);
    }

    // The method below draws the player's image
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.height, this.width);
    }
}

class EatableObject {
    constructor(src, startX, startY) {
        this.image = new Image();
        this.image.src = src;
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.show = true;
        this.height = 65;
        this.width = 65;
        this.deleteMe = false;
    }

    update(time) {
        if(this.x < -65){
            this.deleteMe = true;
        };
        this.x = this.startX - (2* increase) * time;
    }

    draw(context) {
        if (this.show == true && this.x >= -65 && this.x < 1100 && this.y >= 0 && this.y <= 700) {
            context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }

    collide() {
        this.show = false;
        score = score + 10;
        updateScore(score);
        this.deleteMe = true;
    }
}

class NotEat {
    constructor(src, startX, startY) {
        this.image = new Image();
        this.image.src = src;
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.show = true;
        this.height = 60;
        this.width = 60;
        this.deleteMe = false;
    }

    update(time) {
        if(this.x < -60){
            this.deleteMe = true;
        };
        this.x = this.startX - (increase * 2) * time;
    }

    draw(context) {
        if (this.show == true && this.x >= -60 && this.x < 1100 && this.y >= 0 && this.y <= 700) {
            context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }
    collide() {
        this.show = false;
        this.deleteMe = true;
        lives--;
        updateLives(lives);
        if (lives <= 0) {
            hideStart();
            showEnd();
        };

    }
}

class Enemy {
    constructor(src, startX, startY) {
        this.image = new Image();
        this.image.src = src;
        this.x = startX;
        this.y = startY;
        this.startY = startY;
        this.startX = startX;
        this.show = true;
        this.height = 90;
        this.width = 90;
        this.deleteMe = false;
    }

    update(time, player) {
        if(this.x < -90){
            this.deleteMe = true;
        };
        this.x = this.startX - (increase * 2) * time;

        if (player.y > this.startY) {
            this.startY += 0.7;
        } else if (player.y < this.startY) {
            this.startY -= 0.7;
        }

        this.y = this.startY + 5 * Math.sin(1 * Math.PI * time);
    }

    draw(context) {
        if (this.show == true && this.x >= -90 && this.x < 1100) {
            context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }
    collide() {
        this.show = false;
        this.deleteMe = true;
        lives -= 3;
        if (lives <= 0) {
            hideStart();
            showEnd();
        };
        //alert("die")
        //score[0] += 10;

    }
}

class Heart {
    constructor(src, startX, startY) {
        this.image = new Image();
        this.image.src = src;
        this.x = startX;
        this.y = startY;
        this.startY = startY;
        this.startX = startX;
        this.show = true;
        this.height = 50;
        this.width = 50;
        this.deleteMe = false;
    }

    update(time) {
        if(this.x < -50){
            this.deleteMe = true;
        };
        this.x = this.startX - increase * time;
        this.y = this.startY + 1 * Math.sin(4 * Math.PI * time);
    }

    draw(context) {
        if (this.show == true && this.x >= -60 && this.x < 1100 && this.y >= 0 && this.y <= 700) {

            context.save();
            context.translate(this.x, this.y);

            const scale = 1 + (Math.abs((this.x / 3) % 10 - 5) / 40);

            context.scale(scale, scale);

            context.drawImage(this.image, 0, 0, this.height, this.width);

            context.restore();
            //context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }
    collide() {
        this.show = false;
        this.deleteMe = true;
        if (lives < 3) {
            lives++;
            updateLives(lives);
        }
        score = score + 20;
        updateScore(score);

    }
}

var lives = 3;
var score = 0;
//
window.onload = function () {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    //
    let mapLength = 5 * 1100;

    function generateFood(src) {
        let items = [];
        for (let i = 0; i < 20; i++) {
            let x = 1100 + Math.random() * mapLength;
            let y = Math.random() * 700 - 50;
            let item = new EatableObject(src, x, y);
            items.push(item);
        }
        return items;
    }

    function generateMen(src) {
        let items = [];
        for (let i = 0; i < 10; i++) {
            let x = 1100 + Math.random() * mapLength;
            let y = Math.random() * 700 - 50;
            let item = new NotEat(src, x, y);
            items.push(item);
        }
        return items;
    }

    function generateHearts(src) {
        let items = [];
        for (let i = 0; i < 3; i++) {
            let x = 1100 + Math.random() * mapLength;
            let y = Math.random() * 700 - 50;
            let item = new Heart(src, x, y);
            items.push(item);
        }
        return items;
    }

    function generateEnemy(src) {
        let items = [];
        for (let i = 0; i < 2; i++) {
            let x = 1100 + Math.random() * mapLength;
            let y = Math.random() * 700 - 50;
            let item = new Enemy(src, x, y);
            items.push(item);
        }
        return items;
    }

    //check collission
    function isCollission(a, b) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }

    //create instances
    let player = new Player();
    let objectsArray = [
        generateFood("burger.png"),
        generateFood("veg1.png"),
        generateMen("man.png"),
        generateEnemy("enemy.png"),
        generateHearts("heart.png")
    ].flat();

    /*
        
        function checkLives() {
            document.getElementById("lives").innerHTML = this.lives
        }
    */
    //
    let time = 0;
    function gameLoop() {
        context.clearRect(0, 0, 1100, 700);

        // here you can draw EVERYTHING!!!
        player.update(time);
        player.draw(context);
        

        for (let i = 0; i < objectsArray.length; i++) {
            objectsArray[i].update(time, player);
            objectsArray[i].draw(context);
            if (isCollission(player, objectsArray[i])) {
                objectsArray[i].collide();
                objectsArray.splice(i, 1);
            };
        }

        objectsArray = objectsArray.filter(obj => !obj.deleteMe);

        setTimeout(gameLoop, 20);
        time += 0.020;
    
        time += score / 50 * 0.009;
        
        
    }

    var start = document.getElementById("start");
    start.addEventListener("click", function() {
        gameLoop();
    });

    var startAgain = document.getElementById("againStart");
    startAgain.addEventListener("click", function(){
        gameLoop();
        location.reload();
    });


    //set control
    window.addEventListener("keydown", function (e) {
        switch (e.key) {
            case 'ArrowUp':
                if (player.y - 20 >= 0) {
                    player.startY -= 20
                }
                break;
            case 'ArrowDown':
                if (player.y + player.height + 20 <= 700) {
                    player.startY += 20
                }
                break;
        }
    });
}