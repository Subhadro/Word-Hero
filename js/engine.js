class GameEngine {
    constructor() {
        window.gameActive = false;
        window.gamePaused = false;
        this.timeLeft = 60;
        this.timerInterval = null;
        this.boundKeyHandler = this.handleKeyPress.bind(this);
    }

    startGame(difficultyKey) {
        const config = WORD_DATABASE[difficultyKey];
        if (!config) return;

        ScoreState.reset();
        window.gameActive = true;
        window.gamePaused = false;
        this.timeLeft = 60;

        document.getElementById('timer-val').textContent = this.timeLeft;

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('game-screen').classList.add('active');

        LaneSystem.setupLanes(config.lanes);
        GameSpawner.start(config);

        AudioSystem.startBGM();
        this.startTimer();
        this.initKeyboardListeners();
    }

    initKeyboardListeners() {
        window.removeEventListener('keydown', this.boundKeyHandler);
        window.addEventListener('keydown', this.boundKeyHandler);
    }

    handleKeyPress(e) {
        if (!window.gameActive || window.gamePaused) return;

        // Map keys '1', '2', '3', '4' to lanes 0, 1, 2, 3
        const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3 };
        if (keyMap.hasOwnProperty(e.key)) {
            const laneIndex = keyMap[e.key];
            if (laneIndex < LaneSystem.lanes.length) {
                LaneSystem.handleLaneInput(laneIndex);
            }
        }
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            if (!window.gameActive || window.gamePaused) return;

            this.timeLeft--;
            document.getElementById('timer-val').textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        window.gameActive = false;
        GameSpawner.stop();
        AudioSystem.stopBGM();
        if (this.timerInterval) clearInterval(this.timerInterval);
        ReportScreen.showReport();
    }

    togglePause() {
        window.gamePaused = !window.gamePaused;
        document.getElementById('pause-btn').textContent = window.gamePaused ? '▶' : '⏸';
    }
}

const Engine = new GameEngine();