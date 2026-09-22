/**
 * Reproductor de Música de YouTube en Segundo Plano
 * Canción: Flores Amarillas (Floricienta) [URL: https://youtu.com/S7gMzYqXIZc]
 */

class SoundManager {
    constructor() {
        this.audioCtx = null;
        this.ytPlayer = null;
        this.ytReady = false;
        this.isPlaying = false;
        this.videoId = 'S7gMzYqXIZc';
        
        this.initYouTubeAPI();
    }

    initYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            this.createPlayer();
        } else {
            window.onYouTubeIframeAPIReady = () => {
                this.createPlayer();
            };
        }
    }

    createPlayer() {
        if (this.ytPlayer) return;
        try {
            this.ytPlayer = new YT.Player('yt-player', {
                height: '200',
                width: '200',
                videoId: this.videoId,
                playerVars: {
                    'autoplay': 0,
                    'controls': 0,
                    'loop': 1,
                    'playlist': this.videoId,
                    'playsinline': 1,
                    'enablejsapi': 1,
                    'origin': window.location.origin
                },
                events: {
                    'onReady': () => {
                        this.ytReady = true;
                        if (this.isPlaying) {
                            this.playMusic();
                        }
                    }
                }
            });
        } catch (e) {
            console.log('Error al crear reproductor de YouTube:', e);
        }
    }

    initCtx() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playMusic() {
        this.initCtx();
        this.isPlaying = true;

        if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
            try {
                this.ytPlayer.unMute();
                this.ytPlayer.setVolume(100);
                this.ytPlayer.playVideo();
            } catch (e) {
                console.log('Error de reproduccion:', e);
            }
        } else {
            // Reintentar si el reproductor de YouTube aún se está cargando
            setTimeout(() => {
                if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
                    this.ytPlayer.unMute();
                    this.ytPlayer.setVolume(100);
                    this.ytPlayer.playVideo();
                }
            }, 600);
        }
    }

    pauseMusic() {
        this.isPlaying = false;
        if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
            try {
                this.ytPlayer.pauseVideo();
            } catch (e) {
                console.log('Error de pausa:', e);
            }
        }
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
            return false;
        } else {
            this.playMusic();
            return true;
        }
    }

    playNote(freq, duration = 0.3, type = 'sine', volume = 0.15) {
        this.initCtx();
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
            console.log('Audio pop error:', e);
        }
    }

    playPop() {
        const freq = 523.25 + Math.random() * 300;
        this.playNote(freq, 0.2, 'sine', 0.15);
    }

    playSparkle() {
        const baseFreq = 800;
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.playNote(baseFreq + i * 200, 0.3, 'sine', 0.1);
            }, i * 60);
        }
    }
}

window.soundManager = new SoundManager();
