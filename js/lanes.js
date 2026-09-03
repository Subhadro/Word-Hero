class LaneManager {
	constructor(arenaId) {
		this.arena = document.getElementById(arenaId);
		this.activeNodes = {}; // { laneIndex: [ {nodeElement, wordObj, posY}, ... ] }
	}

	setupLanes(numLanes) {
		this.invalidateNodes();
		this.runId = (this.runId || 0) + 1;
		this.arena.innerHTML = "";
		this.lanes = [];
		this.activeNodes = {};

		for (let i = 0; i < numLanes; i++) {
			const lane = document.createElement("div");
			lane.className = "lane";
			lane.dataset.laneIndex = i;

			// Add Key Marker at the bottom
			const marker = document.createElement("div");
			marker.className = "lane-marker";
			marker.textContent = i + 1; // Keys 1, 2, 3, 4
			lane.appendChild(marker);

			this.arena.appendChild(lane);
			this.lanes.push(lane);
			this.activeNodes[i] = [];
		}
	}

	getRandomLaneIndex() {
		return Math.floor(Math.random() * this.lanes.length);
	}

	spawnNode(wordObj, laneIndex, speed, onComplete) {
		const lane = this.lanes[laneIndex];
		if (!lane) return;
		const runId = this.runId;

		const node = document.createElement("div");
		node.className = "word-node";
		node.textContent = wordObj.text;
		node.style.top = "-50px";

		lane.appendChild(node);

		const nodeData = {
			element: node,
			wordObj: wordObj,
			posY: -50,
			resolved: false,
		};

		this.activeNodes[laneIndex].push(nodeData);

		const arenaHeight = this.arena.clientHeight;

		const animate = () => {
			if (nodeData.resolved || runId !== this.runId) return;

			if (!window.gameActive || window.gamePaused) {
				requestAnimationFrame(animate);
				return;
			}

			nodeData.posY += speed;
			node.style.top = `${nodeData.posY}px`;

			// Check if missed bottom
			if (nodeData.posY > arenaHeight - 60) {
				nodeData.resolved = true;
				node.remove();
				const index = this.activeNodes[laneIndex].indexOf(nodeData);
				if (index > -1) this.activeNodes[laneIndex].splice(index, 1);

				if (wordObj.type === "positive") {
					ScoreState.addMissed();
				} else {
					ScoreState.addDodgedNegative();
				}
				if (onComplete) onComplete("missed", wordObj);
				return;
			}

			requestAnimationFrame(animate);
		};

		requestAnimationFrame(animate);
	}

	invalidateNodes() {
		Object.values(this.activeNodes).forEach(nodes => {
			nodes.forEach(nodeData => {
				nodeData.resolved = true;
				nodeData.element.remove();
			});
		});
	}

	// Triggered when user presses key for a lane
	handleLaneInput(laneIndex) {
		const nodes = this.activeNodes[laneIndex];
		if (!nodes || nodes.length === 0) return;

		// Flash lane marker
		const laneEl = this.lanes[laneIndex];
		laneEl.classList.add("active-hit");
		setTimeout(() => laneEl.classList.remove("active-hit"), 150);

		// Get the lowest node (closest to hit zone)
		const targetNode = nodes.reduce(
			(lowest, current) =>
				current.posY > lowest.posY ? current : lowest,
			nodes[0],
		);

		if (targetNode) {
			targetNode.resolved = true;
			const index = nodes.indexOf(targetNode);
			if (index > -1) nodes.splice(index, 1);

			if (targetNode.wordObj.type === "positive") {
				ScoreState.addCorrect();
				AudioSystem.playHit();
				targetNode.element.classList.add("result-correct");
			} else {
				ScoreState.addMistake();
				AudioSystem.playMistake();
				targetNode.element.classList.add("result-wrong");
			}

			setTimeout(() => targetNode.element.remove(), 450);
		}
	}
}

const LaneSystem = new LaneManager("game-arena");
