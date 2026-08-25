class ScoreManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.correctCount = 0;
        this.mistakeCount = 0;
        this.missedCount = 0;
        this.totalSpawned = 0;
    }

    addCorrect() {
        this.streak++;
        if (this.streak > this.maxStreak) this.maxStreak = this.streak;
        const multiplier = Math.min(Math.floor(this.streak / 5) + 1, 4);
        const points = 10 * multiplier;
        this.score += points;
        this.correctCount++;
        this.updateUI();
    }

    addMistake() {
        this.streak = 0;
        this.score = Math.max(0, this.score - 5);
        this.mistakeCount++;
        this.updateUI();
    }

    addMissed() {
        this.streak = 0;
        this.score = Math.max(0, this.score - 2);
        this.missedCount++;
        this.updateUI();
    }

    getAccuracy() {
        const totalAttempts = this.correctCount + this.mistakeCount;
        if (totalAttempts === 0) return 100;
        return Math.round((this.correctCount / totalAttempts) * 100);
    }

    updateUI() {
        const scoreEl = document.getElementById('score-val');
        const streakEl = document.getElementById('streak-val');
        if (scoreEl) scoreEl.textContent = this.score;
        if (streakEl) streakEl.textContent = `${this.streak}x`;
    }
}

const ScoreState = new ScoreManager();