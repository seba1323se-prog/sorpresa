/**
 * Web Audio API Sound Synthesizer
 * Genera música relajante de piano/arpegios y efectos de sonido en tiempo real sin requerir archivos mp3 externos.
 */

class SoundManager {
    constructor() {
        this.audioCtx = null;
        this.isPlaying = false;
        this.timer = null;
        this.noteIndex = 0;

        // Notas musicales en Hz (Frecuencias dulces para C Mayor / Sol)
        this.notes = [
            261.63, 329.63, 392.00, 523.25, // C4, E4, G4, C5
            293.66, 369.99, 440.00, 587.33, // D4, F#4, A4, D5
            329.63, 392.00, 493.88, 659.25, // E4, G4, B4, E5
            349.23, 440.00, 523.25, 698.46  // F4, A4, C5, F5
        ];
    }

    initCtx() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playNote(freq, duration = 1.2, type = 'sine', volume = 0.15) {
        if (!this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        } catch (e) {
            console.log('Audio play error:', e);
        }
    }

    toggleMusic() {
        this.initCtx();
        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) {
            this.startLoop();
        } else {
            this.stopLoop();
        }
        return this.isPlaying;
    }

    startLoop() {
        if (this.timer) clearInterval(this.timer);
        this.noteIndex = 0;

        this.timer = setInterval(() => {
            if (!this.isPlaying) return;
            const freq = this.notes[this.noteIndex % this.notes.length];
            this.playNote(freq, 1.5, 'sine', 0.12);
            
            // Nota armoniosa secundaria ocasional
            if (this.noteIndex % 3 === 0) {
                this.playNote(freq * 1.5, 2.0, 'triangle', 0.05);
            }

            this.noteIndex++;
        }, 450);
    }

    stopLoop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    playPop() {
        this.initCtx();
        const freq = 523.25 + Math.random() * 300;
        this.playNote(freq, 0.3, 'sine', 0.2);
    }

    playSparkle() {
        this.initCtx();
        const baseFreq = 800;
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.playNote(baseFreq + i * 200, 0.4, 'sine', 0.1);
            }, i * 70);
        }
    }
}

window.soundManager = new SoundManager();
