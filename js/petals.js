/**
 * Canvas Animation: Yellow Petals & Floating Sparkles
 * 21 de Septiembre - Flores Amarillas
 */

(function () {
    const canvas = document.getElementById('petalsCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let petals = [];
    let petalCount = 45;
    const colors = ['#FFD700', '#FFC107', '#FFE082', '#FFB300', '#FFF176'];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = random(0, width);
            this.y = random(-height * 0.5, 0);
            this.size = random(8, 18);
            this.speedY = random(1.2, 2.8);
            this.speedX = random(-0.8, 0.8);
            this.rotation = random(0, Math.PI * 2);
            this.rotationSpeed = random(-0.03, 0.03);
            this.color = colors[Math.floor(random(0, colors.length))];
            this.opacity = random(0.6, 0.95);
            this.sway = random(0.01, 0.03);
            this.swayCount = random(0, Math.PI * 2);
        }

        update() {
            this.y += this.speedY;
            this.swayCount += this.sway;
            this.x += Math.sin(this.swayCount) * 1.2 + this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            // Dibujar pétalo estilo lágrima/ovalado
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
            ctx.fill();

            // Brillo central suave
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.arc(0, this.size / 3, this.size / 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    function init() {
        petals = [];
        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach((petal) => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addMorePetals = function () {
        for (let i = 0; i < 25; i++) {
            petals.push(new Petal());
        }
    };

    init();
    animate();
})();
