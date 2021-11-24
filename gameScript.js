let cvs                     = document.getElementById("canvas");
let ctx                     = cvs.getContext("2d");
let bg                      = new Image();       
bg.src                      = "Photo/Phones/BG.png";

let baseX = 10, baseY       = 380;
let windowsWidth            = cvs.width;

let Person                  = addPerson();
let numberOfEnemys          = 10;
let Enemys                  = new Array();

const ACTIONS = {
    RIGHT:   1,
    LEFT:    2,
    UP:      3,
    FIGHT:   4,
    WAIT:    5,
};

function showXP(obj) {
    let XP_line = new Image();
    XP_line.src = obj.XP_path;
    ctx.drawImage(XP_line,obj.posX,obj.posY - obj.image.height,70 / ((obj.XP_max/obj.XP_current)),50);
}
function addPerson() {
    let Person = new Object({
        XP_path:                 "Photo/other/XP.png",
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
        animation_fight:        1,
        animation_index_max:    4,
        animation_fight_max:    5,
        ACTION_TYPE:            null,

        XP_current:             100,
        XP_max:                 100,

        damage:                 30.1,
        damage_R:               100,
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
        XP_path:                "Photo/other/XP_enemy.png",
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
        animation_fight:        1,
        animation_index_max:    4,
        animation_fight_max:    4,

        ACTION_TYPE:            null,

        XP_current:             100,
        XP_max:                 100,

        damage:                 1,
        damage_R:               3,
    });
    Enemy.image.src      = "Photo/Enemys/Blue runner/walk_l_1.png";
    ;
    Enemy.animation_atack = function(arg) {
        this.ACTION_TYPE = ACTIONS.FIGHT;
        if (this.animation_fight !== 1) return;
        const a = () => {
            if (this.animation_fight === this.animation_fight_max) {
                this.animation_fight = 1;
                return;
            } 
            else this.image.src = `${this.path}fight${arg}${this.animation_fight++}.png`;
        setTimeout(a, 300);
        }
    a();
    }

    Enemy.start           = function() {
        this.ACTION_TYPE = ACTIONS.LEFT;
        setInterval(() => {
            if(this.ACTION_TYPE == ACTIONS.WAIT) alert("Enemy.start() -> {this.ACTION_TYPE == ACTIONS.WAIT}");
            else if(Math.abs(this.posX - Person.posX) < this.damage_R) {
                if(this.ACTION_TYPE == ACTIONS.LEFT) this.animation_atack("_l_");
                else                                 this.animation_atack("_r_");
            }
            else if(Person.posX < this.posX) {
                this.ACTION_TYPE = ACTIONS.LEFT;
                move(this);
                if(Math.abs(this.posX - Person.posX) < 300) this.animation_atack("_l_");
                this.ACTION_TYPE = ACTIONS.LEFT;
            }
            else {
                this.ACTION_TYPE = ACTIONS.RIGHT;
                move(this);
                if(Math.abs(this.posX - Person.posX) < 300) this.animation_atack("_r_");
                this.ACTION_TYPE = ACTIONS.RIGHT;
            }
        }, 100);
    };
    return Enemy;
}
function addBlueRunners(number) {
    if(typeof(number) === typeof(0)) {
        let BlueRunners = new Array();
        for(let i = 0;i < number; i++) {
            BlueRunners[i] = addBlueRunner();
            BlueRunners[i].posX = Math.floor(windowsWidth * Math.random() + windowsWidth/2);
            BlueRunners[i].start();
        }
        return BlueRunners;
    }
    else return null;
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
        if (obj.animation_fight !== 1) return;
        const a = () => {
            if (obj.animation_fight === obj.animation_fight_max) {
                for(let i = 0;i < Enemys.length;i++) {
                    if(Math.abs(Person.posX - Enemys[i].posX) < Person.damage_R) {
                        if(Enemys[i].XP_current > 0) Enemys[i].XP_current -= Person.damage;
                        else Enemys.splice(i, 1); 
                    } 
                }
                obj.image.src = `${obj.path}wait.png`;
                obj.animation_fight = 1;
                return;
            } 
            else {
                obj.image.src = `${obj.path}fight${obj.animation_fight++}.png`;
            }
        setTimeout(a, 120);
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
        animation(obj, "");
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
});

function reset() {
    Enemys.splice(0,Enemys.length);
    Person = addPerson();
    Enemys = addBlueRunners(numberOfEnemys);
}

Enemys = addBlueRunners(numberOfEnemys);

function draw() {
    ctx.drawImage(bg, 0, 0,1440,720);
    ctx.drawImage(Person.image, Person.posX, Person.posY, Person.image.width * 2, Person.image.height * 2);
    
    for(let i = 0;i < Enemys.length;i++) {
        showXP(Enemys[i]);
        ctx.drawImage(Enemys[i].image, Enemys[i].posX, Enemys[i].posY, Enemys[i].image.width * 2, Enemys[i].image.height * 2);
        if(Math.abs(Person.posX - Enemys[i].posX) < Enemys[i].damage_R) {
            if(Person.XP_current > 0) Person.XP_current -= Enemys[i].damage + 100;
            else {
                alert("Game over");
                reset();
            }
        }
        else if(Person.XP_current < Person.XP_max) Person.XP_current += 0.15;
    }
    Person.flying();
    showXP(Person);

    requestAnimationFrame(draw);
}
bg.onload = draw;