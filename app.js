var explosionAudio = new Audio('explosion-6055.mp3');
var fireAudio = new Audio('mixkit-short-laser-gun-shot-1670.wav');


let screenHeight = document.body.clientHeight;
let screenWidth = document.body.clientWidth;

const bulletContainer = document.querySelector('#bulletContainer');
const mySpeedText = document.querySelector('#mySpeed');
const myBulletSpeedText = document.querySelector('#myBulletSpeed');
const myBulletsAmountText = document.querySelector('#myBulletsAmount');
const myMaxBulletsAmountText = document.querySelector('#myMaxBulletsAmount');
const myBulletDamageText = document.querySelector('#myBulletDamage');

const enemySpeedText = document.querySelector('#enemySpeed');
const enemyBulletSpeedText = document.querySelector('#enemyBulletSpeed');
const enemyBulletsAmountText = document.querySelector('#enemyBulletsAmount');
const enemyMaxBulletsAmountText = document.querySelector('#enemyMaxBulletsAmount');
const enemyBulletDamageText = document.querySelector('#enemyBulletDamage');

/*explosion image*/
const explosion1 = document.querySelector('#explosion1')
const explosion2 = document.querySelector('#explosion2')
/*healtbar*/
const myCurrentHealthBar = document.querySelector('#myShipHealthBarHealth')
const enemyCurrentHealthBar = document.querySelector('#enemyShipHealthBarHealth')

let myBullets = [];
let enemyBullets = [];
let myBulletSpeed = 100;
let enemyBulletSpeed = 100;
let enemyFirePossibility = 0.4;
let myBulletDamage = 5;
let enemyBulletDamage = 34;
const enemyDx = 50;
const myDx = 50;
let myMaxBullets = 5;
let enemyMaxBullets = 5;

class Ship {
    constructor(name, dx, type) {
        this.image = document.querySelector('#' + name);
        this.x = 0;
        type === 'my' ? this.y = screenHeight - 100 : this.y = 0;
        this.width = 100;
        this.height = 100;
        this.maxHealth = 5;
        this.health = 100;
        this.dx = dx;
        this.type = type;
    }
    isalive() {
        return this.health > 0;
    }
    setX(x) {
        this.x = x;
        this.image.style.left = `${x}px`;
    }
    setY(y) {
        this.x = x;
        this.image.style.left = `${x}px`;
    }
    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.image.style.left = `${x}px`;
        this.image.style.top = `${y}px`;
    }
    moveLeft(dx = this.dx) {
        if (this.x - dx > 0) {
            this.setX(this.x - dx);
            this.leftMost = false;
        }
        else {
            this.setX(0);
            this.leftMost = true;
        }
        this.rightMost = false;
    }
    moveRight(dx = this.dx) {
        if (this.x + dx + this.width < screenWidth) {
            this.setX(this.x + dx);
            this.rightMost = false;
        }
        else {
            this.setX(screenWidth - this.width);
            this.rightMost = true;
        }
        this.leftMost = false;
    }
    fire() {
        if (this.type === 'my' && myBullets.length < myMaxBullets) {
            myBullets.push(new Bullet('my', this.x + 50, this.y + myBulletSpeed, myBulletSpeed));
            fireAudio.play();
        }
        else if (this.type === 'enemy') {
            enemyBullets.push(new Bullet('enemy', this.x + 50, this.y + 100, enemyBulletSpeed));
            fireAudio.play();
        }

    }
}
const myShip = new Ship('myShip', myDx, 'my')
const enemyShip = new Ship('enemyShip', enemyDx, 'enemy')
myShip.setX(screenWidth / 2 - myShip.width)
let gameOver = false;


enemyShip.setXY(0, 0)
enemyShip['direction'] = 'right';
enemyShip['changeDirection'] = function () {
    this.direction === "right" ? this.direction = 'left' : this.direction = 'right';
    console.log(this)
};
enemyShip['moving'] = function (dx) {
    if (this.direction === 'right') {
        if (!this.rightMost) {
            this.moveRight(dx);
        }
        else {
            this.changeDirection();
        }
    }
    else {
        if (!this.leftMost) {
            this.moveLeft(dx);
        }
        else {
            this.changeDirection();
        }
    }
}

function flyAndFire() {
    Math.random() < enemyFirePossibility ? enemyShip.fire() : 1;
    for (let bullet of myBullets) {
        bullet.fly();
    }
    for (let bullet of enemyBullets) {
        bullet.fly();
    }
}
function checkMyBullets() {
    for (let myBullet of myBullets) {
        if ((myBullet.y <= 100 && myBullet.y >= 0) && (myBullet.x >= enemyShip.x && myBullet.x <= enemyShip.x + 100)) {

            explosion1.style.left = `${enemyShip.x}px`;
            explosion1.style.top = `${enemyShip.y}px`;
            explosion1.style.visibility = 'visible';
            explosionAudio.play();
            setTimeout(() => (explosion1.style.visibility = 'hidden'), 200)

            enemyShip.health -= myBulletDamage;
            removeBullet(myBullet, 'my')
        }
    }
}
function checkEnemyBullets() {
    for (let enemyBullet of enemyBullets) {
        if ((enemyBullet.y >= myShip.y && enemyBullet.y <= myShip.y + 100) && (enemyBullet.x >= myShip.x && enemyBullet.x <= myShip.x + 100)) {

            explosion2.style.left = `${myShip.x}px`;
            explosion2.style.top = `${myShip.y}px`;
            explosion2.style.visibility = 'visible';
            explosionAudio.play();
            setTimeout(() => (explosion2.style.visibility = 'hidden'), 200)
            myShip.health -= enemyBulletDamage;
            removeBullet(enemyBullet, 'enemy')
        }
    }
}

window.addEventListener('keydown', (e) => {

    myCurrentHealthBar.style.height = `${myShip.health}px`
    enemyCurrentHealthBar.style.height = `${enemyShip.health}px`
    if (e.code === "ArrowLeft") {
        myShip.moveLeft();
        enemyShip.moving(enemyDx);
        flyAndFire()
    }
    else if (e.code === "ArrowRight") {
        myShip.moveRight();
        enemyShip.moving(enemyDx);
        flyAndFire()
    }
    else if (e.code === 'Space') {
        myShip.fire()
    }

    mySpeedText.textContent = myDx + 'px';
    myBulletSpeedText.textContent = myBulletSpeed + 'px';
    myBulletsAmountText.textContent = myBullets.length;
    myMaxBulletsAmountText.textContent = myMaxBullets;
    myBulletDamageText.textContent = `${myBulletDamage}`;

    enemySpeedText.textContent = enemyDx + 'px';
    enemyBulletSpeedText.textContent = enemyBulletSpeed + 'px';
    enemyBulletsAmountText.textContent = enemyBullets.length;
    enemyMaxBulletsAmountText.textContent = enemyMaxBullets;
    enemyBulletDamageText.textContent = `${enemyBulletDamage}`;

    checkEnemyBullets()
    checkMyBullets()

    if (myShip.health <= 0) {
        alert("gameover, you loose")
    }
    else if (enemyShip.health <= 0) {
        alert('You Win!')
    }
})

class Bullet {
    constructor(type, x, y, speed) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.entity = document.createElement('div');
        this.entity.classList.add('bullet', type);
        bulletContainer.appendChild(this.entity)
        this.entity.style.left = `${x}px`;
        this.entity.style.top = `${y}px`;
    }
    fly() {
        if (this.type === 'my') {
            this.y -= this.speed;
            this.entity.style.top = `${this.y}px`;
        }
        else if (this.type === 'enemy') {
            this.y += this.speed;
            this.entity.style.top = `${this.y}px`;
        }
        if (this.y < 0 || this.y > screenHeight) {
            if (this.type === 'my') {
                removeBullet(this, 'my');
            }
            else if (this.type === 'enemy') {
                removeBullet(this, 'enemy')
            }
        }
    }
    deleteEntity() {
        this.entity.remove();
    }
}
function removeBullet(bullet, type) {
    bullet.deleteEntity();
    if (type === 'my') {
        myBullets.shift()
    }
    else if (type === 'enemy') {
        enemyBullets.shift()
    }
}
