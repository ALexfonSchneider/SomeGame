let cvs                     = document.getElementById("canvas");
let ctx                     = cvs.getContext("2d");
let bg = new Image();       bg.src = "Photo/Phones/BG.png";

let baseX = 10, baseY = 380;
let Person = new Object({
    step: 15,
    grav: 6,
    is_fly: false,
    in_sky: true,
    start_f: baseY,
    heightOfFly: 100,
    animation_index: 1,
    animation_index_max: 4,
});
Person.image = new Image();
Person.posX = baseX;
Person.posY = baseY;
Person.image.src = "Photo/Persons/Glen/wait.png";
Person.path = "Photo/Persons/Glen/";

let Enemy = Object.assign({}, Person);
Enemy.image = new Image();
Enemy.image.src = "Photo/Enemys/Blue runner/walk_l_1.png";
Enemy.posX = 1380;
Enemy.posY = baseY;
Enemy.step = 15;
Enemy.path = "Photo/Enemys/Blue runner/"
Enemy.start = function() {
    setInterval(() => {
        if(Person.posX < this.posX) move(this,"left");
    else move(this,"right");
    }, 105);
};

Person.flying = function() {
    if(this.is_fly === true) {
        if(this.posY > this.start_f - this.heightOfFly) this.posY -= this.grav;
        else this.is_fly = false;
    }
    else if(this.posY < baseY) this.posY += this.grav;
    else this.in_sky = false;
}
function right(obj) {
    if(obj.in_sky) obj.posX += obj.step / 2;
    else obj.posX += obj.step;
}
function left(obj) {
    if(obj.in_sky) obj.posX -= obj.step / 2;
    else obj.posX -= obj.step;
}
function fly(obj) {
    if(obj.is_fly === false) {
        obj.start_f = obj.posY;
        obj.is_fly = true;
        obj.in_sky = true;
    }
}
function animation(obj, cadr) {
    if(cadr.name === "right") {
        obj.image.src = `${obj.path}walk_r_${obj.animation_index}.png`;
    }
    if(cadr.name === "left") {
        obj.image.src = `${obj.path}walk_l_${obj.animation_index}.png`;
    }
}

function move(obj, key) {
    if(key == "right") {
        right(obj);
        animation(obj, {name: "right"});
    }
    if(key == "left") { // 37 is <--
        left(obj);
        animation(obj, {name: "left"});
    }     
    obj.animation_index = ((obj.animation_index >= 4) ? 1 : obj.animation_index + 1);                     
    if(key == "up") { // 38 is |^
        fly(obj);               
    }                        
}

document.addEventListener('keydown', function() {
    key = event.keyCode;
    if(key == 39) move(Person,"right");
    if(key == 37) move(Person,"left");             
    if(key == 38) move(Person,"up");
});

document.addEventListener('keyup', function() { 
    Person.image.src = "Photo/Persons/Glen/wait.png"
});


Enemy.start();
function draw() {
    ctx.drawImage(bg, 0, 0,1440,720);
    ctx.drawImage(Person.image, Person.posX, Person.posY, Person.image.width * 2, Person.image.height * 2);
    ctx.drawImage(Enemy.image, Enemy.posX, Enemy.posY, Enemy.image.width * 2, Enemy.image.height * 2);

    Person.flying();
    requestAnimationFrame(draw);
}
bg.onload = draw;