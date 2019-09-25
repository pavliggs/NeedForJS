const score = document.querySelector('.score'),
    startMain = document.querySelector('.start-main'),
    startField = document.querySelector('.start-gamefield'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    music = document.createElement('embed'),
    levels = document.querySelector('.levels'),
    light = document.querySelector('.light'),
    medium = document.querySelector('.medium'),
    high = document.querySelector('.high');

music.setAttribute('type', 'audio/mp3');
music.setAttribute('src', './audio.mp3');
music.classList.add('music');

car.classList.add('car');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

startMain.addEventListener('click', levelSelection);
light.addEventListener('click', lightLevel);
medium.addEventListener('click', mediumtLevel);
high.addEventListener('click', highLevel);
startField.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);


function levelSelection() {
    startMain.classList.add('hide');
    levels.classList.remove('hide');
}

function lightLevel() {
    levels.classList.add('hide');
    setting.traffic = 4;
    startGame();
}

function mediumtLevel() {
    levels.classList.add('hide');
    setting.traffic = 3;
    startGame();
}

function highLevel() {
    levels.classList.add('hide');
    setting.traffic = 2;
    startGame();
}

// функция, которая вычисляет количество элементов, помещающихся на страницу вдоль оси Y
function getQuantityElements(heightElement) {
    return Math.ceil(gameArea.offsetHeight / heightElement) + 1;

}

function startGame() {
    gameArea.classList.remove('hide');
    score.classList.remove('hide');
    startField.classList.add('hide');
    gameArea.innerHTML = "";

    for (let i = 0; i < getQuantityElements(50); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.y = i * 50;
        line.style.top = line.y + 'px';
        gameArea.appendChild(line);
    }

    for (let i  = 0; i < getQuantityElements(106 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        let number = Math.floor(Math.random() * (4 - 1)) + 1;
        console.log('number: ', number);
        enemy.y = -106 * setting.traffic * (i + 1);
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.round(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.background = `transparent url(./img/enemy${number}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    gameArea.appendChild(music);
    car.style.bottom = '10px';
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px';
    car.style.top = 'auto';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        setting.score += setting.speed;
        score.innerHTML = 'SCORE<br>' + setting.score;
        moveRoad();
        moveEnemy();

        if (keys.ArrowLeft && setting.x > 0 ) {
            setting.x -= setting.speed;
        }

        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    event.preventDefault();

    // условие, которое проверяет, содержится ли нажатая кнопка в нашем объекте keys
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }

    // //другой способ проверки
    // if (event.key in keys) {
    //     keys[event.key] = true;
    // }

}

function stopRun(event) {
    event.preventDefault();

    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(item) {
        item.y += setting.speed;
        item.style.top = item.y + 'px';

        if (item.y >= gameArea.offsetHeight) {
            item.y = -50;
        }
    });
}

function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function(item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        // console.log(carRect);
        if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top) {
            setting.start = false;
            console.warn('ДТП');
            music.remove();
            startField.classList.remove('hide');
            startField.style.top = score.offsetHeight + 'px';
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        //проверяем уехала ли машина соперника за нижнюю черту экрана монитора
        if (item.y >= gameArea.offsetHeight) {
            item.y = -106 * setting.traffic;
            item.style.left = Math.round(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}

