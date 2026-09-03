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
		this.updateUI();
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
		AudioSystem.playMistake();
	}
	addDodgedNegative() {
		//NOTE: streak 
		const points = this.streak >= 10 ? 20 : 10;
		this.score += points;
		this.updateUI();
		this.showScoreGain(points);

		AudioSystem.playDodgeSound();
	}

	getAccuracy() {
		const totalAttempts = this.correctCount + this.mistakeCount;
		if (totalAttempts === 0) return 100;
		return Math.round((this.correctCount / totalAttempts) * 100);
	}

	updateUI() {
		const scoreEl = document.getElementById("score-val");
		const streakEl = document.getElementById("streak-val");
		const arenaEl = document.getElementById("game-arena");
		//NOTE: streak 
		const boostActive = this.streak >= 10;
		if (scoreEl) scoreEl.textContent = this.score;
		if (streakEl) streakEl.textContent = `${this.streak}x`;
		if (arenaEl) arenaEl.classList.toggle("streak-boost", boostActive);
		if (scoreEl?.parentElement) {
			scoreEl.parentElement.classList.toggle("streak-boost", boostActive);
		}
		if (streakEl?.parentElement) {
			streakEl.parentElement.classList.toggle("streak-boost", boostActive);
		}
		if (boostActive) {
			AudioSystem.startStreakBoost();
		} else {
			AudioSystem.stopStreakBoost();
		}
	}

	showScoreGain(points) {
		const scoreEl = document.getElementById("score-val");
		if (!scoreEl || !scoreEl.parentElement) return;

		const gainEl = document.createElement("span");
		gainEl.className = "score-gain";
		gainEl.textContent = `+${points}`;
		scoreEl.parentElement.appendChild(gainEl);
		gainEl.addEventListener("animationend", () => gainEl.remove(), {
			once: true,
		});
	}
}

const ScoreState = new ScoreManager();
