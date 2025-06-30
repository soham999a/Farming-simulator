// ✨ ADVANCED VISUAL EFFECTS SYSTEM

export const particleEffects = {
  harvest: {
    id: 'harvest',
    particles: [
      { emoji: '✨', count: 8, spread: 50, duration: 1000 },
      { emoji: '💰', count: 3, spread: 30, duration: 1500 },
      { emoji: '🌟', count: 5, spread: 40, duration: 1200 }
    ],
    sound: 'harvest.mp3',
    screenShake: { intensity: 2, duration: 300 }
  },
  plant: {
    id: 'plant',
    particles: [
      { emoji: '🌱', count: 5, spread: 25, duration: 800 },
      { emoji: '💚', count: 3, spread: 20, duration: 1000 }
    ],
    sound: 'plant.mp3',
    screenShake: { intensity: 1, duration: 200 }
  },
  levelUp: {
    id: 'levelUp',
    particles: [
      { emoji: '🎉', count: 15, spread: 80, duration: 2000 },
      { emoji: '⭐', count: 10, spread: 60, duration: 1800 },
      { emoji: '🏆', count: 5, spread: 40, duration: 2200 }
    ],
    sound: 'levelup.mp3',
    screenShake: { intensity: 3, duration: 500 }
  },
  achievement: {
    id: 'achievement',
    particles: [
      { emoji: '🏅', count: 8, spread: 50, duration: 1500 },
      { emoji: '✨', count: 12, spread: 70, duration: 1800 }
    ],
    sound: 'achievement.mp3',
    screenShake: { intensity: 2, duration: 400 }
  },
  disease: {
    id: 'disease',
    particles: [
      { emoji: '🦠', count: 6, spread: 30, duration: 1000 },
      { emoji: '💀', count: 3, spread: 20, duration: 1200 }
    ],
    sound: 'disease.mp3',
    color: '#ff4444'
  },
  weather: {
    rain: {
      particles: [{ emoji: '💧', count: 20, spread: 100, duration: 3000 }],
      background: 'rain-overlay'
    },
    storm: {
      particles: [
        { emoji: '⚡', count: 8, spread: 80, duration: 1500 },
        { emoji: '💧', count: 25, spread: 120, duration: 3000 }
      ],
      background: 'storm-overlay',
      screenShake: { intensity: 4, duration: 2000 }
    },
    snow: {
      particles: [{ emoji: '❄️', count: 15, spread: 100, duration: 4000 }],
      background: 'snow-overlay'
    }
  }
};

export const animations = {
  cropGrowth: {
    stages: [
      { scale: 0.3, opacity: 0.7, rotation: -10 }, // seed
      { scale: 0.5, opacity: 0.8, rotation: -5 },  // sprout
      { scale: 0.7, opacity: 0.9, rotation: 0 },   // growing
      { scale: 0.9, opacity: 1.0, rotation: 2 },   // flowering
      { scale: 1.0, opacity: 1.0, rotation: 0 },   // mature
      { scale: 1.1, opacity: 1.0, rotation: 0, glow: true } // ready
    ],
    duration: 500 // ms per stage transition
  },
  fieldPulse: {
    keyframes: [
      { transform: 'scale(1)', boxShadow: '0 0 0 rgba(34, 197, 94, 0.4)' },
      { transform: 'scale(1.02)', boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)' },
      { transform: 'scale(1)', boxShadow: '0 0 0 rgba(34, 197, 94, 0.4)' }
    ],
    duration: 2000,
    iterations: 'infinite'
  },
  moneyCounter: {
    keyframes: [
      { transform: 'scale(1)', color: '#059669' },
      { transform: 'scale(1.2)', color: '#10b981' },
      { transform: 'scale(1)', color: '#059669' }
    ],
    duration: 600
  },
  notification: {
    enter: {
      keyframes: [
        { transform: 'translateX(100%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
      ],
      duration: 300
    },
    exit: {
      keyframes: [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(100%)', opacity: 0 }
      ],
      duration: 300
    }
  }
};

export class VisualEffectsSystem {
  constructor() {
    this.activeEffects = new Map();
    this.particleContainer = null;
    this.soundEnabled = true;
    this.effectsEnabled = true;
    this.particlePool = [];
    this.animationQueue = [];
  }

  // Initialize the effects system
  initialize() {
    // Create particle container
    this.particleContainer = document.createElement('div');
    this.particleContainer.id = 'particle-container';
    this.particleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    document.body.appendChild(this.particleContainer);

    // Pre-create particle pool
    this.createParticlePool(100);
  }

  // Create particle pool for performance
  createParticlePool(count) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        font-size: 24px;
        pointer-events: none;
        user-select: none;
        z-index: 10000;
        display: none;
      `;
      this.particleContainer.appendChild(particle);
      this.particlePool.push(particle);
    }
  }

  // Get particle from pool
  getParticle() {
    return this.particlePool.find(p => p.style.display === 'none') || this.createNewParticle();
  }

  // Create new particle if pool is empty
  createNewParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      font-size: 24px;
      pointer-events: none;
      user-select: none;
      z-index: 10000;
    `;
    this.particleContainer.appendChild(particle);
    this.particlePool.push(particle);
    return particle;
  }

  // Return particle to pool
  returnParticle(particle) {
    particle.style.display = 'none';
    particle.style.transform = '';
    particle.style.opacity = '';
    particle.textContent = '';
  }

  // Trigger particle effect
  triggerParticleEffect(effectId, position, customData = {}) {
    if (!this.effectsEnabled) return;

    const effect = particleEffects[effectId];
    if (!effect) return;

    const effectInstance = {
      id: Date.now().toString(),
      type: effectId,
      position,
      startTime: Date.now(),
      particles: []
    };

    // Create particles for each type in the effect
    effect.particles.forEach(particleType => {
      for (let i = 0; i < particleType.count; i++) {
        const particle = this.getParticle();
        if (!particle) continue;

        // Set particle content
        particle.textContent = particleType.emoji;
        particle.style.display = 'block';

        // Calculate random position within spread
        const spreadX = (Math.random() - 0.5) * particleType.spread;
        const spreadY = (Math.random() - 0.5) * particleType.spread;
        const startX = position.x + spreadX;
        const startY = position.y + spreadY;

        // Set initial position
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.opacity = '1';

        // Animate particle
        this.animateParticle(particle, particleType, effectInstance.id);
        effectInstance.particles.push(particle);
      }
    });

    // Play sound effect
    if (effect.sound && this.soundEnabled) {
      this.playSound(effect.sound);
    }

    // Screen shake effect
    if (effect.screenShake) {
      this.triggerScreenShake(effect.screenShake.intensity, effect.screenShake.duration);
    }

    this.activeEffects.set(effectInstance.id, effectInstance);

    // Clean up after duration
    setTimeout(() => {
      this.cleanupEffect(effectInstance.id);
    }, Math.max(...effect.particles.map(p => p.duration)) + 500);
  }

  // Animate individual particle
  animateParticle(particle, particleType, effectId) {
    const startTime = Date.now();
    const duration = particleType.duration;
    
    // Random movement direction
    const velocityX = (Math.random() - 0.5) * 100;
    const velocityY = -Math.random() * 150 - 50; // Generally upward
    const gravity = 0.5;
    const fadeStart = duration * 0.7;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        this.returnParticle(particle);
        return;
      }

      // Calculate position with physics
      const x = velocityX * progress;
      const y = velocityY * progress + gravity * progress * progress * 100;

      // Calculate opacity (fade out in last 30%)
      let opacity = 1;
      if (elapsed > fadeStart) {
        opacity = 1 - ((elapsed - fadeStart) / (duration - fadeStart));
      }

      // Apply transforms
      particle.style.transform = `translate(${x}px, ${y}px) scale(${1 - progress * 0.3})`;
      particle.style.opacity = opacity;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  // Trigger screen shake
  triggerScreenShake(intensity, duration) {
    const body = document.body;
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        body.style.transform = '';
        return;
      }

      const currentIntensity = intensity * (1 - progress);
      const x = (Math.random() - 0.5) * currentIntensity;
      const y = (Math.random() - 0.5) * currentIntensity;

      body.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(shake);
    };

    requestAnimationFrame(shake);
  }

  // Play sound effect
  playSound(soundFile, volume = 0.3) {
    if (!this.soundEnabled) return;

    try {
      const audio = new Audio(`/assets/sounds/${soundFile}`);
      audio.volume = volume;
      audio.play().catch(() => {
        // Ignore audio errors if files don't exist
      });
    } catch (error) {
      // Ignore audio errors
    }
  }

  // Animate crop growth stages
  animateCropGrowth(element, stage) {
    if (!this.effectsEnabled || !element) return;

    const stageData = animations.cropGrowth.stages[stage];
    if (!stageData) return;

    // Apply stage animation
    element.style.transition = `all ${animations.cropGrowth.duration}ms ease-out`;
    element.style.transform = `scale(${stageData.scale}) rotate(${stageData.rotation}deg)`;
    element.style.opacity = stageData.opacity;

    // Add glow effect for ready stage
    if (stageData.glow) {
      element.style.filter = 'drop-shadow(0 0 10px #10b981)';
      element.style.animation = 'pulse 2s infinite';
    } else {
      element.style.filter = '';
      element.style.animation = '';
    }
  }

  // Animate money counter
  animateMoneyChange(element, oldValue, newValue) {
    if (!this.effectsEnabled || !element) return;

    // Trigger money animation
    element.style.animation = 'none';
    element.offsetHeight; // Force reflow
    element.style.animation = 'moneyCounter 600ms ease-out';

    // Animate number counting
    const startTime = Date.now();
    const duration = 800;
    const difference = newValue - oldValue;

    const countUp = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth counting
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(oldValue + (difference * easeOut));
      
      element.textContent = `₹${currentValue.toLocaleString()}`;

      if (progress < 1) {
        requestAnimationFrame(countUp);
      }
    };

    requestAnimationFrame(countUp);
  }

  // Create floating text effect
  createFloatingText(text, position, color = '#10b981', size = '18px') {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.cssText = `
      position: absolute;
      left: ${position.x}px;
      top: ${position.y}px;
      color: ${color};
      font-size: ${size};
      font-weight: bold;
      pointer-events: none;
      z-index: 10001;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    `;

    this.particleContainer.appendChild(textElement);

    // Animate floating text
    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        textElement.remove();
        return;
      }

      const y = -progress * 100;
      const opacity = 1 - progress;
      const scale = 1 + progress * 0.5;

      textElement.style.transform = `translateY(${y}px) scale(${scale})`;
      textElement.style.opacity = opacity;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  // Weather overlay effects
  createWeatherOverlay(weatherType) {
    const existingOverlay = document.getElementById('weather-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'weather-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1000;
    `;

    // Apply weather-specific styling
    switch (weatherType) {
      case 'rain':
        overlay.style.background = 'linear-gradient(transparent 0%, rgba(0,100,200,0.1) 100%)';
        break;
      case 'storm':
        overlay.style.background = 'linear-gradient(transparent 0%, rgba(50,50,50,0.3) 100%)';
        break;
      case 'snow':
        overlay.style.background = 'linear-gradient(transparent 0%, rgba(255,255,255,0.1) 100%)';
        break;
    }

    document.body.appendChild(overlay);

    // Trigger weather particles
    if (particleEffects.weather[weatherType]) {
      this.triggerParticleEffect(`weather_${weatherType}`, { x: window.innerWidth / 2, y: 0 });
    }
  }

  // Clean up effect
  cleanupEffect(effectId) {
    const effect = this.activeEffects.get(effectId);
    if (!effect) return;

    // Return all particles to pool
    effect.particles.forEach(particle => {
      this.returnParticle(particle);
    });

    this.activeEffects.delete(effectId);
  }

  // Clean up all effects
  cleanup() {
    this.activeEffects.forEach((effect, id) => {
      this.cleanupEffect(id);
    });

    // Remove weather overlay
    const overlay = document.getElementById('weather-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  // Toggle effects
  toggleEffects(enabled) {
    this.effectsEnabled = enabled;
    if (!enabled) {
      this.cleanup();
    }
  }

  // Toggle sound
  toggleSound(enabled) {
    this.soundEnabled = enabled;
  }

  // Get element position for effects
  getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }
}

// Global visual effects system instance
export const visualEffectsSystem = new VisualEffectsSystem();
