function updateScore(score) {
    document.getElementById("score").innerHTML = score;
}

function updateLives(lives){ 
    const livesContainer = document.getElementById("lives");
    livesContainer.innerHTML = '';

    for (let i = 0; i < lives; i++) {
        var x = document.createElement("IMG");
        x.src = "heart.png";
        livesContainer.appendChild(x)
    }
}


class Player {
    constructor(context) {
        this.x = 50;
        this.startY = 300;
        this.y = 0;
        this.height = 130;
        this.width = 130;
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
        this.height = 70;
        this.width = 70;
    }

    update(time) {
        this.x = this.startX - 80 * time;
    }

    draw(context) {
        if (this.show == true && this.x >= 0 && this.x < 1100 && this.y >= 0 && this.y <= 700) {
            context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }

    collide() {
        this.show = false;
        score = score + 5;
        updateScore(score);
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
        this.height = 70;
        this.width = 70;
    }

    update(time) {
        this.x = this.startX - 80 * time;
    }

    draw(context) {
        if (this.show == true && this.x >= 0 && this.x < 1100 && this.y >= 0 && this.y <= 700) {
            context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }
    collide() {
        this.show = false;
        this.show = false;
        lives --;
        updateLives(lives);

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
        this.height = 100;
        this.width = 100;
    }

    update(time, player) {
        this.x = this.startX - 80 * time;

        if (player.y > this.startY){
            this.startY += 1;
        } else if(player.y < this.startY){
            this.startY -= 1;
        }

        this.y = this.startY + 5 * Math.sin(1 * Math.PI * time);
    }

    draw(context) {
        if (this.show == true && this.x >= 0 && this.x < 1100) {
            context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }
    collide() {
        this.show = false;
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
        this.height = 80;
        this.width = 80;
    }

    update(time) {
        this.x = this.startX - 50 * time;
        this.y = this.startY + 1 * Math.sin(4 * Math.PI * time);
    }

    draw(context) {
        if (this.show == true && this.x >= 0 && this.x < 1100 && this.y >= 0 && this.y <= 700) {
            
            context.save();
            context.translate( this.x, this.y);

            const scale = 1 + (Math.abs((this.x / 3) % 10  - 5)/ 40);

            context.scale(scale, scale);

            context.drawImage(this.image, 0, 0, this.height, this.width);

            context.restore();
            //context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }
    collide() {
        this.show = false;
        if(lives < 3){
        lives ++;
        updateLives(lives);
        }
        /*var parent = document.getElementById("lives");
        var heart = document.getElementById("lives").image;
        if(heart < 3){
        var x = document.createElement("IMG");
        x.src = "heart.png";
        parent.appendChild(x);
        }
        */
        
    }
}

var lives = 3;
var score = 0;
//
window.onload = function () {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    //
    let mapLength = 2 * 1100;

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
        for (let i = 0; i < 20; i++) {
            let x = 1100 + Math.random() * mapLength;
            let y = Math.random() * 700 - 50;
            let item = new NotEat(src, x, y);
            items.push(item);
        }
        return items;
    }

    function generateHearts(src) {
        let items = [];
        for (let i = 0; i < 30; i++) {
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
    let burgers = generateFood("burger.png");
    let vegetables = generateFood("veg1.png");
    let men = generateMen("man.png");
    let enemy = generateEnemy("enemy.png");
    let heart = generateHearts("heart.png");

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

        for (let i = 0; i < burgers.length; i++) {
            burgers[i].update(time);
            burgers[i].draw(context);
            if (isCollission(player, burgers[i])) {
                burgers[i].collide();
                burgers.splice(i, 1);

            }
        }

        for (let i = 0; i < vegetables.length; i++) {
            vegetables[i].update(time);
            vegetables[i].draw(context);
            if (isCollission(player, vegetables[i])) {
                vegetables[i].collide();
                vegetables.splice(i, 1);
                //context.clearRect(vegetables[i].x, vegetables[i].y, 70, 70);
            };
        }

        for (let i = 0; i < men.length; i++) {
            men[i].update(time);
            men[i].draw(context);
            if (isCollission(player, men[i])) {
                men[i].collide();
                men.splice(i, 1);
            };
        }

        for (let i = 0; i < enemy.length; i++) {
            enemy[i].update(time,player);
            enemy[i].draw(context);
            if (isCollission(player, enemy[i])) {
                enemy[i].collide();
                enemy.splice(i, 1);
            };
        }

        for (let i = 0; i < heart.length; i++) {
            heart[i].update(time);
            heart[i].draw(context);
            if (isCollission(player, heart[i])) {
                heart[i].collide();
                heart.splice(i, 1);
            };
        }

        setTimeout(gameLoop, 20);
        time += 0.020;

    }

    gameLoop();

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