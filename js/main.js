document.addEventListener('DOMContentLoaded', () => {
    // Difficulty card listeners
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.addEventListener('click', () => {
            const difficulty = card.dataset.difficulty;
            Engine.startGame(difficulty);
        });
    });

    // Pause Button
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            Engine.togglePause();
        });
    }

    // Report Actions
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            Engine.startGame('medium'); // Default restart to medium or save last mode
        });
    }

    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            window.gameActive = false;
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById('menu-screen').classList.add('active');
        });
    }
});