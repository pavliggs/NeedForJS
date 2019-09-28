const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    startField = document.querySelector('.start-gamefield'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    easy = document.querySelector('.easy'),
    medium = document.querySelector('.medium'),
    hard = document.querySelector('.hard'),
    newRecordClose = document.querySelector('.record-close'),
    newRecordConst = document.querySelector('.record-const'),
    newRecordConstText = document.querySelector('.record-const__text'),
    newRecordConstBtn = document.querySelector('.record-const__btn'),
    playPause = document.querySelector('.play-pause'),
    playPauseText = document.querySelector('.play-pause__text'),
    playPauseImg = document.querySelector('.play-pause__img');

// добавляем тег audio при помощи конструктора
const audio = new Audio('./audio.mp3'),
// audio.src = './audio.mp3';
    crash = new Audio('./crash.mp3');
console.log(crash);

let allowAddingAudio = false;
audio.addEventListener('loadeddata', function(){
    console.log('аудио файл загружен!');
    allowAddingAudio = true;
});

let topScore = localStorage.getItem('topScore');

car.classList.add('car');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    32: false
};

const setting = {
    start: false,
    score: 0,
    speed: 7,
    traffic: 4
};

start.addEventListener('click', startGame);
startField.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
playPauseImg.addEventListener('click', pauseGameClick);
document.addEventListener('keydown', pauseGamePush);
// newRecordConstBtn.addEventListener('click', clearRecord);

// функция, которая вычисляет количество элементов, помещающихся на страницу вдоль оси Y
function getQuantityElements(heightElement) {
    return Math.ceil(gameArea.offsetHeight / heightElement);
}

// функция добавляет кнопку паузы на игровое поле
function addGameControl() {
    playPause.classList.remove('hide');
    playPauseText.textContent = 'Pause Game';
    playPauseImg.setAttribute('src', './img/pause.svg');
}

//подсчёт кликов
let countPauseClicks = 0;

// функция при клике на картинку паузы меняет картинку на плэй и останавливает музыку с игрой,
// затем считает клики по картинке и если клик чётный, то меняет картинку с плэй обратно на паузу
// и возобновляет музыку с игрой с того же момента
function pauseGameClick(event) {
    event.preventDefault();
    countPauseClicks++;
    console.log(countPauseClicks);
    setting.start = false;
    audio.pause();
    playPauseText.textContent = 'Play Game';
    playPauseImg.setAttribute('src', './img/play.svg');

    if (countPauseClicks % 2 == 0) {
        playPauseText.textContent = 'Pause Game';
        playPauseImg.setAttribute('src', './img/pause.svg');
        audio.play();
        setting.start = true;
        playGame();
    }
}

// функция, которая реализовывает паузу при нажатии на клавишу "пробел"
function pauseGamePush(event) {
    event.preventDefault();
    if (keys.hasOwnProperty(event.which)) {
        switch (setting.start) {
            case true:
                setting.start = false;
                audio.pause();
                playPauseText.textContent = 'Play Game';
                playPauseImg.setAttribute('src', './img/play.svg');
                break;
            case false:
                playPauseText.textContent = 'Pause Game';
                playPauseImg.setAttribute('src', './img/pause.svg');
                audio.play();
                setting.start = true;
                playGame();
                break;
        }
    }

}

function startGame(event) {

    const target = event.target;

    // если нажата переменная start (в которой находится элемент с классом start),
    // то функция прекратится
    if (target.classList.contains('start')) {
        return;
    }

    if (target.classList.contains('start__text')) {
        return;
    }

    if (target.classList.contains('start__block')) {
        return;
    }

    if (target.classList.contains('easy')) {
        start.classList.add('hide');
    }

    if (target.classList.contains('medium')) {
        start.classList.add('hide');
        setting.traffic = 3;
        setting.speed = 10;
    }

    if (target.classList.contains('hard')) {
        start.classList.add('hide');
        setting.traffic = 3;
        setting.speed = 20;
    }

    gameArea.classList.remove('hide');
    score.classList.remove('hide');
    addGameControl();
    startField.classList.add('hide');
    newRecordClose.classList.add('hide');
    gameArea.innerHTML = "";

    for (let i = 0; i < getQuantityElements(50) + 1; i++) {
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

    // если переменная true, то воспроизводим аудио файл
    if (allowAddingAudio) {
        audio.play();
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);

    // координаты машины после ДТП (то есть, чтобы после столкновения машина принимала начальные координаты)
    car.style.bottom = '10px';
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px';
    car.style.top = 'auto';

    
    if (topScore > 0) {
        newRecordConstText.innerHTML = 'Record<br>' + topScore;
        newRecordConst.classList.remove('hide');
    }

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

    // другой способ проверки
    // if (event.key in keys) {
    //     keys[event.key] = true;
    // }

}

function stopRun(event) {
    event.preventDefault();
    console.dir(event.which);  
    // console.dir(event.key);
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

        // условия пересечения координат машины с машиной соперника (если координаты пересеклись,
        // и машины наехали друг на друга, то ДТП)
        if (carRect.top <= (enemyRect.bottom - 5) && carRect.right >= (enemyRect.left - 5) && 
            carRect.left <= (enemyRect.right - 5) && carRect.bottom >= (enemyRect.top - 5)) {
            setting.start = false;
            console.warn('ДТП');
            audio.pause();
            crash.play();
            startField.classList.remove('hide');
            playPause.classList.add('hide');

            // добавляем набранные очки в хранилище браузера (localStorage) и если при следующей игре
            // вновь набранные очки будут больше предыдущих (то есть рекорд по очкам будет побит),
            // то перезаписываем данные в localStorage и выводим сообщение о новом рекорде
            if (setting.score > topScore) {
                newRecordClose.classList.remove('hide');
                newRecordClose.innerHTML = 'Your New Record<br>' + setting.score;
                newRecordConstText.innerHTML = 'Record<br>' + setting.score;
                localStorage.setItem('topScore', setting.score);
                startField.style.top = newRecordClose.offsetHeight + 'px';

                topScore = localStorage.getItem('topScore');
                console.log(topScore);
                if (topScore > 0) {
                    newRecordConst.classList.remove('hide');
                }

            } else {
                startField.style.top = '0px';
            }
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        // проверяем уехала ли машина соперника за нижнюю черту экрана монитора
        if (item.y >= gameArea.offsetHeight) {
            item.y = -106 * setting.traffic;
            item.style.left = Math.round(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            let number = Math.floor(Math.random() * (4 - 1)) + 1;
            item.style.background = `transparent url(./img/enemy${number}.png) center / cover no-repeat`;
        }
    });
}


