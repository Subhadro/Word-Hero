class Spawner {
	constructor() {
		this.timer = null;
	}

	start(config, onNodeComplete) {
		this.config = config;
		this.onNodeComplete = onNodeComplete;

		this.timer = setInterval(() => {
			if (!window.gameActive || window.gamePaused) return;
			this.spawnWord();
		}, config.spawnInterval);
	}

	spawnWord() {
		const isPositive = Math.random() < this.config.positiveRatio;
		const pool = this.config.words.filter(w =>
			isPositive ? w.type === "positive" : w.type === "negative",
		);
		const wordObj = pool[Math.floor(Math.random() * pool.length)];

		const laneIdx = LaneSystem.getRandomLaneIndex();
		LaneSystem.spawnNode(
			wordObj,
			laneIdx,
			this.config.speed,
			this.onNodeComplete,
		);
	}

	stop() {
		if (this.timer) clearInterval(this.timer);
	}
}

const GameSpawner = new Spawner();
