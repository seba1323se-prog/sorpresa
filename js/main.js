/**
 * Lógica principal de interacción
 * 21 de Septiembre - Tarjeta de Flores Amarillas
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ABRIR TARJETA DESDE LA PANTALLA INICIAL
    const openCardBtn = document.getElementById('openCardBtn');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const cardContent = document.getElementById('cardContent');

    if (openCardBtn) {
        openCardBtn.addEventListener('click', () => {
            if (window.soundManager) {
                window.soundManager.playSparkle();
            }

            // Transición suave
            welcomeScreen.style.transition = 'all 0.6s ease';
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.transform = 'scale(0.8)';

            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                cardContent.classList.remove('hidden');
                cardContent.style.opacity = '0';
                
                requestAnimationFrame(() => {
                    cardContent.style.transition = 'opacity 0.8s ease';
                    cardContent.style.opacity = '1';
                });
            }, 600);
        });
    }

    // 2. NAVEGACIÓN ENTRE PESTAÑAS (Mamá / Hermanas / Jardín)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(targetTab);
            if (activePanel) {
                activePanel.classList.add('active');
            }

            if (window.soundManager) {
                window.soundManager.playPop();
            }
        });
    });

    // 3. CONTROLES DE MÚSICA Y MÁS FLORES
    const musicBtn = document.getElementById('musicBtn');
    const musicText = document.getElementById('musicText');

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            if (window.soundManager) {
                const isPlaying = window.soundManager.toggleMusic();
                if (isPlaying) {
                    musicBtn.classList.add('active');
                    musicText.textContent = 'Música ♪ (On)';
                } else {
                    musicBtn.classList.remove('active');
                    musicText.textContent = 'Música (Off)';
                }
            }
        });
    }

    const sparklesBtn = document.getElementById('sparklesBtn');
    if (sparklesBtn) {
        sparklesBtn.addEventListener('click', () => {
            if (window.addMorePetals) {
                window.addMorePetals();
            }
            if (window.soundManager) {
                window.soundManager.playSparkle();
            }
        });
    }

    // 4. JARDÍN INTERACTIVO (HACER FLORECER)
    const gardenArea = document.getElementById('gardenArea');
    const clearGardenBtn = document.getElementById('clearGardenBtn');
    const fullBouquetBtn = document.getElementById('fullBouquetBtn');
    const flowerTypes = ['🌻', '🌼', '💛', '🌸', '✨'];

    if (gardenArea) {
        gardenArea.addEventListener('click', (e) => {
            // Eliminar instrucción inicial
            const instruction = gardenArea.querySelector('.garden-instruction');
            if (instruction) instruction.remove();

            const rect = gardenArea.getBoundingClientRect();
            const x = e.clientX - rect.left - 20;
            const y = e.clientY - rect.top - 20;

            createFlower(x, y);
        });
    }

    function createFlower(x, y) {
        if (!gardenArea) return;

        const flower = document.createElement('div');
        flower.className = 'bloomed-flower';
        flower.style.left = `${x}px`;
        flower.style.top = `${y}px`;

        const randomSymbol = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        flower.textContent = randomSymbol;

        gardenArea.appendChild(flower);

        if (window.soundManager) {
            window.soundManager.playPop();
        }
    }

    if (clearGardenBtn) {
        clearGardenBtn.addEventListener('click', () => {
            if (gardenArea) {
                gardenArea.innerHTML = '<div class="garden-instruction"><i class="fas fa-hand-pointer pulse"></i> Toca o haz clic aquí para hacer florecer</div>';
            }
        });
    }

    if (fullBouquetBtn) {
        fullBouquetBtn.addEventListener('click', () => {
            if (!gardenArea) return;
            const instruction = gardenArea.querySelector('.garden-instruction');
            if (instruction) instruction.remove();

            const width = gardenArea.clientWidth - 40;
            const height = gardenArea.clientHeight - 40;

            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    const randomX = Math.random() * width + 10;
                    const randomY = Math.random() * height + 10;
                    createFlower(randomX, randomY);
                }, i * 80);
            }
        });
    }
});

// 5. CONTADOR Y EFECTO DE ABRAZOS
const counts = { Mamá: 0, Hermanas: 0 };

function sendLove(target) {
    counts[target] = (counts[target] || 0) + 1;
    const counterEl = document.getElementById(`count${target}`);
    if (counterEl) {
        counterEl.textContent = counts[target];
    }

    if (window.soundManager) {
        window.soundManager.playSparkle();
    }

    // Crear partículas flotantes de corazón en la pantalla
    createHeartParticles();
}

function createHeartParticles() {
    const emojis = ['💖', '💛', '🌻', '✨', '🥰'];
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.position = 'fixed';
        particle.style.left = `${Math.random() * 90 + 5}vw`;
        particle.style.bottom = '20px';
        particle.style.fontSize = `${Math.random() * 1.5 + 1.5}rem`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '999';
        particle.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        particle.style.opacity = '1';

        document.body.appendChild(particle);

        requestAnimationFrame(() => {
            particle.style.transform = `translateY(-${Math.random() * 300 + 200}px) scale(${Math.random() * 0.5 + 1})`;
            particle.style.opacity = '0';
        });

        setTimeout(() => {
            particle.remove();
        }, 1600);
    }
}
