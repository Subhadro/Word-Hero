class LaneManager {
    constructor(arenaId) {
        this.arena = document.getElementById(arenaId);
        this.activeNodes = {}; // { laneIndex: [ {nodeElement, wordObj, posY}, ... ] }
    }

    setupLanes(numLanes) {
        this.arena.innerHTML = '';
        this.lanes = [];
        this.activeNodes = {};

        for (let i = 0; i < numLanes; i++) {
            const lane = document.createElement('div');
            lane.className = 'lane';
            lane.dataset.laneIndex = i;

            // Add Key Marker at the bottom
            const marker = document.createElement('div');
            marker.className = 'lane-marker';
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

        const node = document.createElement('div');
        node.className = 'word-node';
        node.textContent = wordObj.text;
        node.style.top = '-50px';

        lane.appendChild(node);

        const nodeData = {
            element: node,
            wordObj: wordObj,
            posY: -50
        };

        this.activeNodes[laneIndex].push(nodeData);

        const arenaHeight = this.arena.clientHeight;

        const animate = () => {
            if (!window.gameActive || window.gamePaused) {
                requestAnimationFrame(animate);
                return;
            }

            nodeData.posY += speed;
            node.style.top = `${nodeData.posY}px`;

            // Check if missed bottom
            if (nodeData.posY > arenaHeight - 60) {
                node.remove();
                const index = this.activeNodes[laneIndex].indexOf(nodeData);
                if (index > -1) this.activeNodes[laneIndex].splice(index, 1);

                if (wordObj.type === 'positive') {
                    ScoreState.addMissed();
                }
                if (onComplete) onComplete('missed', wordObj);
                return;
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    // Triggered when user presses key for a lane
    handleLaneInput(laneIndex) {
        const nodes = this.activeNodes[laneIndex];
        if (!nodes || nodes.length === 0) return;

        // Flash lane marker
        const laneEl = this.lanes[laneIndex];
        laneEl.classList.add('active-hit');
        setTimeout(() => laneEl.classList.remove('active-hit'), 150);

        // Get the lowest node (closest to hit zone)
        const targetNode = nodes.reduce((lowest, current) => (current.posY > lowest.posY) ? current : lowest, nodes[0]);

        if (targetNode) {
            const index = nodes.indexOf(targetNode);
            if (index > -1) nodes.splice(index, 1);

            if (targetNode.wordObj.type === 'positive') {
                ScoreState.addCorrect();
                AudioSystem.playHit();
                targetNode.element.classList.add('result-correct');
            } else {
                ScoreState.addMistake();
                AudioSystem.playMistake();
                targetNode.element.classList.add('result-wrong');
            }

            setTimeout(() => targetNode.element.remove(), 450);
        }
    }
}

const LaneSystem = new LaneManager('game-arena');