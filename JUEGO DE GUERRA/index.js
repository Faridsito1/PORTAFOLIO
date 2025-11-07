        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        createParticles();

        document.addEventListener('mousemove', (e) => {
            const logo = document.querySelector('.logo-container');
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            logo.style.transform = `translate(${x}px, ${y}px)`;
        });

        document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector(".start-button");
    const logo = document.querySelector(".logo-container");

    if (startButton) {
        startButton.addEventListener("click", () => {
            startButton.classList.add("start-pressed");
            logo.classList.add("logo-zoom");

            const audio = new Audio("media/sonidos/whoosh.mp3");
            audio.volume = 0.5;
            audio.play();

            setTimeout(() => {
                document.body.classList.add("fade-out");
            }, 1200);

            setTimeout(() => {
                window.location.href = "menu.html";
            }, 2000);
        });
    }
    });