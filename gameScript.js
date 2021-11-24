let cvs                     = document.getElementById("canvas");
let ctx                     = cvs.getContext("2d");
let bg = new Image();       bg.src = "Photo/Phones/BG.png";

let baseX = 10, baseY       = 380;
let windowsWidth            = cvs.width;

let Person                  = addPerson();
let Enemys                  = new Array(),
                              numberOfEnemys = 12;
const ACTIONS = {
    RIGHT:   1,
    LEFT:    2,
    UP:      3,
    FIGHT:   4,
    WAIT:    5,
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
    Person.image.src     = `${Person.path}wait.png`;
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
        ACTION_TYPE:            null,
    });
    Enemy.image.src      = "Photo/Enemys/Blue runner/walk_l_1.png";
    Enemy.start          = function() {
        setInterval(() => {
            if(Person.posX < this.posX) {
                this.ACTION_TYPE = ACTIONS.LEFT;
                move(this);
            }
            else {
                this.ACTION_TYPE = ACTIONS.RIGHT;
                move(this);
            }
            // alert(this.posX);
        }, 100);
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

function animation(obj) {
    if(obj.ACTION_TYPE == ACTIONS.RIGHT) {
        obj.image.src = `${obj.path}walk_r_${obj.animation_index}.png`;
        obj.animation_index = ((obj.animation_index >= obj.animation_index_max) ? 1 : obj.animation_index + 1);
    }
    else if(obj.ACTION_TYPE == ACTIONS.LEFT) {
        obj.image.src = `${obj.path}walk_l_${obj.animation_index}.png`;
        obj.animation_index = ((obj.animation_index >= obj.animation_index_max) ? 1 : obj.animation_index + 1);
    }
    else if(obj.ACTION_TYPE == ACTIONS.FIGHT) {
        if (obj.animation_fight !== 1) {
            return;
        }
        const a = () => {
            if (obj.animation_fight === obj.animation_fight_max) {
                obj.image.src = `${obj.path}wait.png`;
                obj.animation_fight = 1;
                return;
            } 
            else obj.image.src = `${obj.path}fight_l_${obj.animation_fight++}.png`;
        setTimeout(a, 100);
        }
    a();
    }
}

function move(obj) {
    if(obj.ACTION_TYPE == ACTIONS.RIGHT) {
        right(obj);
        animation(obj);
    }
    if(obj.ACTION_TYPE == ACTIONS.LEFT) {
        left(obj);
        animation(obj);
    }
    if(obj.ACTION_TYPE == ACTIONS.UP) {
        fly(obj);
    }
    if(obj.ACTION_TYPE == ACTIONS.FIGHT) {
        animation(obj);
    }
}

document.addEventListener('keydown', (e) => {
    let action = null;
    const code  = e.code;

    switch (code) {
        case 'Space':
            action = ACTIONS.FIGHT;
            break;
        case 'ArrowRight':
            action = ACTIONS.RIGHT;  
            break;
        case 'ArrowLeft':
            action = ACTIONS.LEFT;
            break;
        case 'ArrowUp':
            action = ACTIONS.UP;
            break;
    }

    if (action !== null) {
        Person.ACTION_TYPE = action;
        e.preventDefault();
        move(Person);
    }
});

document.addEventListener('keyup', function()   {
    Person.image.src = "Photo/Persons/Glen/wait.png";
    Person.ACTION_TYPE = ACTIONS.WAIT;
    Person.animation_index = 1;
    Person.animation_fight = 1;
});

for(let i = 0;i < numberOfEnemys;i++) {
    Enemys[i] = addBlueRunner();
    Enemys[i].posX = Math.floor(windowsWidth * Math.random() + windowsWidth);
    Enemys[i].start();
}

function draw() {
    ctx.drawImage(bg, 0, 0,1440,720);
    ctx.drawImage(Person.image, Person.posX, Person.posY, Person.image.width * 2, Person.image.height * 2);

    for(let i = 0;i < Enemys.length;i++) {
        if(Person.ACTION_TYPE === ACTIONS.FIGHT && (Math.abs(Person.posX - Enemys[i].posX) < 30)) Enemys.splice(i, 1);   
        else ctx.drawImage(Enemys[i].image, Enemys[i].posX, Enemys[i].posY, Enemys[i].image.width * 2, Enemys[i].image.height * 2);
    }
    Person.flying();

    requestAnimationFrame(draw);
}
bg.onload = draw;