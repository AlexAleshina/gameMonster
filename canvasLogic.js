function updateScore(score) {
    document.getElementById("score").innerHTML = score;
    document.getElementById("scoreEnd").innerHTML = score;
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
    var start = document.getElementsByClassName("gameStartMainPage")[0];
    start.style.display = "none";
}
function showStart() {
    var start = document.getElementsByClassName("gameStartMainPage")[0];
    start.style.display = "flex";
}
function hideEnd() {
    var end = document.getElementsByClassName("endGameThirdPage")[0];
    end.style.display = "none";
}
function showEnd() {
    var end = document.getElementsByClassName("endGameThirdPage")[0];
    end.style.display = "flex";
}
function playMusictheEnd() {
    let audioEl = document.getElementsByClassName("endMusic")[0];
    audioEl.play();
}
function playFoodCollide() {
    let audioEl = document.getElementsByClassName("food")[0];
    audioEl.play();
}
function playMenCollide() {
    let audioEl = document.getElementsByClassName("men")[0];
    audioEl.play();
}
function playHeartCollide() {
    let audioEl = document.getElementsByClassName("heart")[0];
    audioEl.play();
}



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
        this.y = this.startY + 8 * Math.sin(2 * Math.PI * time / 2);
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
        this.show = true;
        this.height = 65;
        this.width = 65;
        this.deleteMe = false;
    }

    update(time, player, timeDelta) {
        if (this.x < -65) {
            this.deleteMe = true;
        };

        this.x -= 2 * speed * timeDelta;
    }

    draw(context) {
        if (this.show == true && this.x >= -65 && this.x < 1250 && this.y >= 0 && this.y <= 700) {
            context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }

    collide() {
        this.show = false;
        score = score + 10;
        updateScore(score);
        this.deleteMe = true;
        playFoodCollide();
    }
}

class NotEat {
    constructor(src, startX, startY) {
        this.image = new Image();
        this.image.src = src;
        this.x = startX;
        this.y = startY;
        this.show = true;
        this.height = 60;
        this.width = 60;
        this.deleteMe = false;
    }

    update(time, player, timeDelta) {
        if (this.x < -60) {
            this.deleteMe = true;
        };
        this.x -= (speed * 2) * timeDelta;
    }

    draw(context) {
        if (this.show == true && this.x >= -60 && this.x < 1250 && this.y >= 0 && this.y <= 700) {
            context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }
    collide() {
        this.show = false;
        this.deleteMe = true;
        lives--;
        playMenCollide();
        updateLives(lives);
        if (lives <= 0) {
            isPlaying = false;
            hideStart();
            showEnd();
            playMusictheEnd();
        };

    }
}

class Enemy {
    constructor(startX, startY) {
        this.image = new Image();
        this.image.src = "enemy.png";
        this.x = startX;
        this.y = startY;
        this.startY = startY;
        this.show = true;
        this.height = 90;
        this.width = 90;
        this.deleteMe = false;
    }

    update(time, player, timeDelta) {
        if (this.x < -90) {
            this.deleteMe = true;
        };

        this.x -= (speed * 2) * timeDelta;

        if (player.y > this.startY) {
            this.startY += 20 * timeDelta;
        } else if (player.y < this.startY) {
            this.startY -= 20 * timeDelta;
        }

        this.y = this.startY + 5 * Math.sin(1 * Math.PI * time / 2);
    }

    draw(context) {
        if (this.show == true && this.x >= -90 && this.x < 1250) {
            context.drawImage(this.image, this.x, this.y, this.height, this.width);
        }
    }
    collide() {
        this.show = false;
        this.deleteMe = true;
        lives -= 3;
        if (lives <= 0) {
            isPlaying = false;
            hideStart();
            showEnd();
            playMusictheEnd();
        };
        //alert("die")
        //score[0] += 10;

    }
}

class Heart {
    constructor(startX, startY) {
        this.image = new Image();
        this.image.src = "heart.png";
        this.x = startX;
        this.y = startY;
        this.startY = startY;
        this.show = true;
        this.height = 55;
        this.width = 55;
        this.deleteMe = false;
    }

    update(time, player, timeDelta) {
        if (this.x < -50) {
            this.deleteMe = true;
        };
        this.x -= speed * timeDelta;
        this.y = this.startY + 1 * Math.sin(4 * Math.PI * time / 2);
    }

    draw(context) {
        if (this.show == true && this.x >= -60 && this.x < 1250 && this.y >= 0 && this.y <= 700) {

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
        playHeartCollide();
        if (lives < 3) {
            lives++;
            updateLives(lives);
        }
        score = score + 20;
        updateScore(score);

    }
}

var speed = 30;
let lives = 3;
let score = 0;
let isPlaying = true;

const maxItemsOnScreen = 20;

//
window.onload = function () {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    //check collission
    function isCollission(a, b) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }

    function generateNewObjects(count, score) {
        // calculate probabilities
        const burgersCount = 10 + Math.floor(score / 100) * 2.5;
        const vegetablesCount = 10 + Math.floor(score / 100) * 2.5;
        const menCount = 5 + Math.floor(score / 50) * 5;
        const heartCount = 2 + Math.floor(score / 100);
        const enemyCount = 1 + Math.floor(score / 50);

        const totalCount = burgersCount + vegetablesCount + menCount + heartCount + enemyCount;

        const burgerProb = burgersCount / totalCount;
        const vegetablesProb = vegetablesCount / totalCount;
        const menProb = menCount / totalCount;
        const heartProb = heartCount / totalCount;
        const enemyProb = enemyCount / totalCount;

        // generate objects
        function generateObject() {
            const x = 1250 + Math.random() * 1250;
            const y = Math.random() * 700 - 70;

            const rndValue = Math.random();
            if (rndValue <= burgerProb) return new EatableObject("burger.png", x, y);
            if (rndValue <= burgerProb + vegetablesProb) return new EatableObject("veg1.png", x, y);
            if (rndValue <= burgerProb + vegetablesProb + menProb) return new NotEat("man.png", x, y);
            if (rndValue <= burgerProb + vegetablesProb + menProb + heartProb) return new Heart(x, y);
            else return new Enemy(x, y);
        }

        let items = [];
        for (let i = 0; i < count; i++) {
            items.push(generateObject());
        }

        return items;
    }

    //create instances
    let player = new Player();
    let objectsArray = generateNewObjects(maxItemsOnScreen, score);

    //
    let time = 0;
    let timeDelta = 0;

    function gameLoop() {
        context.clearRect(0, 0, 1250, 700);

        // here you can draw EVERYTHING!!!
        player.update(time);
        player.draw(context);

        for (let i = 0; i < objectsArray.length; i++) {
            objectsArray[i].update(time, player, timeDelta);
            objectsArray[i].draw(context);
            if (isCollission(player, objectsArray[i])) {
                objectsArray[i].collide();
            };
        }

        objectsArray = objectsArray.filter(obj => !obj.deleteMe);

        const newItemsCount = maxItemsOnScreen - objectsArray.length;
        if (newItemsCount > 0) {
            const newItems = generateNewObjects(newItemsCount, score);
            objectsArray = objectsArray.concat(newItems)
        }

        if (isPlaying) {
            setTimeout(gameLoop, 20);
        }

        timeDelta = 0.020;
        timeDelta += score / 50 * 0.009;
        time += timeDelta;
    }

    var start = document.getElementById("start");
    start.addEventListener("click", function () {
        gameLoop();
    });

    var startAgain = document.getElementById("againStart");
    startAgain.addEventListener("click", function () {
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

    canvas.addEventListener("mousemove", function (e) {
        var rect = e.target.getBoundingClientRect();
        var y = e.clientY - rect.top;
        player.startY = y - player.height / 2;
    });
}