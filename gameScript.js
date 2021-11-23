let cvs                     = document.getElementById("canvas");
let ctx                     = cvs.getContext("2d");
let bg = new Image();       bg.src = "Photo/Phones/BG.png";

let baseX = 10, baseY       = 380;
let NumberOfSpawnPoints     = 99;
let windowsWidth            = cvs.width;

const ACTIONS = {
    RIGHT: 1,
    LEFT: 2,
    UP: 3,
    FIGHT: 4,
};

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
        ACTION_TYPE:            null,
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
}
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

function animation(obj, cadr) {
    if(cadr.name === "right") {
        obj.ACTION_TYPE = ACTIONS.RIGHT;

        obj.image.src = `${obj.path}walk_r_${obj.animation_index}.png`;
        obj.animation_index = ((obj.animation_index >= obj.animation_index_max) ? 1 : obj.animation_index + 1);
    }
    if(cadr.name === "left") {
        obj.ACTION_TYPE = ACTIONS.LEFT;

        obj.image.src = `${obj.path}walk_l_${obj.animation_index}.png`;
        obj.animation_index = ((obj.animation_index >= obj.animation_index_max) ? 1 : obj.animation_index + 1);
    }
    if(cadr.name === "fight") {
        obj.ACTION_TYPE = ACTIONS.FIGHT;

        if (obj.animation_fight !== 1) {
            return;
        }

        const a = () => {
            if (obj.ACTION_TYPE !== ACTIONS.FIGHT) {
                obj.animation_fight = 1;
                return;
            }

            if (obj.animation_fight === obj.animation_fight_max) {
                obj.image.src = `${obj.path}wait.png`;
                obj.animation_fight = 1;
                return;
            } else {
                obj.image.src = `${obj.path}fight_l_${obj.animation_fight++}.png`;
            }

            setTimeout(a, 100);
        }

        a();
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
        animation(obj, {name: "fight"});
    }
}

document.addEventListener('keydown', (e) => {
    let action = null;

    const { code } = e;

    switch (code) {
        case 'Space':
            action = 'fight';
            break;
        case 'ArrowRight':
            action = 'right';
            break;
        case 'ArrowLeft':
            action = 'left';
            break;
        case 'ArrowUp':
            action = 'up';
            break;
    }

    if (action !== null) {
        e.preventDefault();

        move(Person, action);
    }
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
            Enemys[i].posX = 10000;
        }
    }
    Person.flying();

    requestAnimationFrame(draw);
}
bg.onload = draw;
