// JParty interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add some interactive elements when the page loads
    console.log('🎉 JParty is ready to rock! 🎉');
    
    // Add floating particles effect
    createFloatingParticles();
    
    // Add click effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
});

function startParty() {
    const message = document.getElementById('party-message');
    const button = document.querySelector('.cta-button');
    
    // Show the party message
    message.classList.remove('hidden');
    
    // Change button text
    button.textContent = '🎊 Party Mode Activated! 🎊';
    button.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
    
    // Add confetti effect
    createConfetti();
    
    // Play celebration sound (if supported)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        playBoop(audioContext);
    } catch (e) {
        console.log('Audio not supported, but the party goes on!');
    }
    
    // Reset button after a few seconds
    setTimeout(() => {
        button.textContent = 'Start Planning Your Party!';
        button.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
    }, 3000);
}

function createFloatingParticles() {
    const particles = ['🎈', '🎉', '⭐', '💫', '🎊', '🌟'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.position = 'fixed';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = '100vh';
            particle.style.fontSize = '1.5rem';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            particle.style.animation = `floatUp ${3 + Math.random() * 2}s linear infinite`;
            
            document.body.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 5000);
        }, i * 2000);
    }
}

function createConfetti() {
    const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];
    const confettiShapes = ['⬛', '⬜', '🔸', '🔹', '⭐', '💎'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.fontSize = Math.random() * 20 + 10 + 'px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 50);
    }
}

function playBoop(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add some fun interactions
document.addEventListener('click', function(e) {
    // Create a small celebration effect on any click
    if (e.target.tagName !== 'BUTTON') {
        const spark = document.createElement('div');
        spark.textContent = '✨';
        spark.style.position = 'fixed';
        spark.style.left = e.clientX + 'px';
        spark.style.top = e.clientY + 'px';
        spark.style.pointerEvents = 'none';
        spark.style.fontSize = '1rem';
        spark.style.animation = 'sparkle 1s ease-out forwards';
        
        document.body.appendChild(spark);
        
        setTimeout(() => {
            if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
            }
        }, 1000);
    }
});

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);