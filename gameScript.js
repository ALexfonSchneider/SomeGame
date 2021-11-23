let cvs                     = document.getElementById("canvas");
let ctx                     = cvs.getContext("2d");
let bg = new Image();       bg.src = "Photo/Phones/BG.png";

let baseX = 10, baseY       = 380;
let NumberOfSpawnPoints     = 99;
let windowsWidth            = cvs.width;

function addPerson() {
    let Person = new Object({
        path:                   "Photo/Persons/Glen/",
        image:                  new Image(),
        posX:                   baseX,
        posY:                   baseY,
        step:                   15,
        grav:                   6,
        is_fly:                 false,
        in_sky:                 true,
        start_f:                baseY,
        heightOfFly:            100,
        animation_index:        1,
        animation_index_max:    4,
        animation_fight:        1,
        animation_fight_max:    5,
    });
    Person.image.src     = "Photo/Persons/Glen/wait.png";
    Person.flying = function()  {
        if(this.is_fly === true) {
            if(this.posY > this.start_f - this.heightOfFly) this.posY -= this.grav;
            else this.is_fly = false;
        }
        else if(this.posY < baseY) this.posY += this.grav;
        else this.in_sky = false;
    }
    return Person;
};
function addBlueRunner() {
    let Enemy = new Object({
        path:                   "Photo/Enemys/Blue runner/",
        image:                  new Image(),
        posX:                   windowsWidth,
        posY:                   baseY,
        step:                   10,
        grav:                   6,
        is_fly:                 false,
        in_sky:                 true,
        start_f:                baseY,
        heightOfFly:            100,
        animation_index:        1,
        animation_index_max:    4,
    });
    Enemy.image.src      = "Photo/Enemys/Blue runner/walk_l_1.png";
    Enemy.start          = function() {
        setInterval(() => {
            if(Person.posX < this.posX) move(this,"left");
        else move(this,"right");
        }, 105);
    };
    return Enemy;
}
function right(obj)         {
    if(obj.in_sky) obj.posX += obj.step / 2;
    else obj.posX += obj.step;
}
function left(obj)          {
    if(obj.in_sky) obj.posX -= obj.step / 2;
    else obj.posX -= obj.step;
}
function fly(obj)           {
    if(obj.is_fly === false && obj.in_sky !== true) {
        obj.start_f = obj.posY;
        obj.is_fly = true;
        obj.in_sky = true;
    }
}
function fight() {
}
function animation(obj, cadr) {
    
    if(cadr.name === "right") {
        obj.image.src = `${obj.path}walk_r_${obj.animation_index}.png`;
        obj.animation_index = ((obj.animation_index >= obj.animation_index_max) ? 1 : obj.animation_index + 1);
    }
    if(cadr.name === "left") {
        obj.image.src = `${obj.path}walk_l_${obj.animation_index}.png`;
        obj.animation_index = ((obj.animation_index >= obj.animation_index_max) ? 1 : obj.animation_index + 1);
    }
    if(cadr.name === "fight") {    
        obj.image.src = `${obj.path}fight_l_${obj.animation_fight}.png`;
        obj.animation_fight = (obj.animation_fight >= obj.animation_fight_max) ? 1 : obj.animation_fight + 1;
    }
}
function move(obj, key) {
    if(key == "right") {
        right(obj);
        animation(obj, {name: "right"});
    }
    if(key == "left") {
        left(obj);
        animation(obj, {name: "left"});
    }              
    if(key == "up") {
        fly(obj);               
    }     
    if(key == "fight") {
        fight(obj);
        animation(obj, {name: "fight"});
    }        
}

document.addEventListener('keydown', function() {
    key = event.keyCode;
    if(key == 32) move(Person,"fight");
    if(key == 39) move(Person,"right");
    if(key == 37) move(Person,"left");             
    if(key == 38) move(Person,"up");
});

document.addEventListener('keyup', function()   { 
    Person.image.src = "Photo/Persons/Glen/wait.png";
    Person.animation_index = 1;
    Person.animation_fight = 1;
});
let Person = addPerson();
let Enemys = new Array();
let numberOfEnemys = 10;
let currentNumberOfEnemys = 2;

for(let i = 0;i < numberOfEnemys;i++) {
    Enemys[i] = addBlueRunner();
    Enemys[i].posX = Math.floor(windowsWidth * Math.random() + windowsWidth); 
    Enemys[i].start();
}

function draw() {
    ctx.drawImage(bg, 0, 0,1440,720);
    ctx.drawImage(Person.image, Person.posX, Person.posY, Person.image.width * 2, Person.image.height * 2);

    for(let i = 0;i < numberOfEnemys;i++) {
        ctx.drawImage(Enemys[i].image, Enemys[i].posX, Enemys[i].posY, Enemys[i].image.width * 2, Enemys[i].image.height * 2);    
    }

    for(let i = 0;i < numberOfEnemys;i++) {
        if(Person.animation_fight > 1 && Math.abs(Person.posX - Enemys[i].posX) < 100) {
            
            numberOfEnemys--;
        } 
    }
    Person.flying();

    requestAnimationFrame(draw);
}
bg.onload = draw;