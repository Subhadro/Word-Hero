class AudioManager {
    constructor() {
        this.ctx = null;
        this.bgmInterval = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }

    playTone(freq, type, duration) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.error(e);
        }
    }

    playHit() {
        this.init();
        this.playTone(587.33, 'triangle', 0.15); // D5
    }

    playMistake() {
        this.init();
        this.playTone(185.0, 'sawtooth', 0.2); // F#3
    }

    startBGM() {
        this.init();
        if (this.bgmInterval) clearInterval(this.bgmInterval);

        const notes = [220, 246.94, 277.18, 329.63, 369.99];
        let idx = 0;

        this.bgmInterval = setInterval(() => {
            if (!window.gameActive || window.gamePaused) return;
            this.playTone(notes[idx % notes.length], 'sine', 0.25);
            idx++;
        }, 600);
    }

    stopBGM() {
        if (this.bgmInterval) clearInterval(this.bgmInterval);
    }
}

const AudioSystem = new AudioManager();