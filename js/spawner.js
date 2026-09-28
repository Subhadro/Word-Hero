class Spawner {
	constructor() {
		this.timer = null;
		this.queues = { positive: [], negative: [] };
	}

	start(config, onNodeComplete) {
		this.config = config;
		this.onNodeComplete = onNodeComplete;
		this.queues = { positive: [], negative: [] };

		this.timer = setInterval(() => {
			if (!window.gameActive || window.gamePaused) return;
			this.spawnWord();
		}, config.spawnInterval);
	}

	_nextWord(type) {
		if (!this.queues[type].length) {
			const pool = this.config.words.filter(w => w.type === type);
			this.queues[type] = [...pool].sort(() => Math.random() - 0.5);
		}
		return this.queues[type].pop();
	}

	spawnWord() {
		const isPositive = Math.random() < this.config.positiveRatio;
		const wordObj = this._nextWord(isPositive ? "positive" : "negative");

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
		this.queues = { positive: [], negative: [] };
	}
}

const GameSpawner = new Spawner();
