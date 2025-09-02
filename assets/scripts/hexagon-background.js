/**
 * Hexagon Background Animation
 * Creates a dynamic hexagonal grid that reacts to mouse movement
 * with cyberpunk-style lighting effects
 */

class HexagonBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.hexagons = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.hexSize = 30;
        this.hexSpacing = 60;
        this.glowRadius = 250; // Aumentado de 150 para 250
        this.maxGlowIntensity = 0.075; // Reduzido em 50% para menos hexágonos acesos
        this.waveSpeed = 0.005;
        this.time = 0;
        this.blinkChance = 0.0003; // Chance de piscar por frame
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.generateHexagons();
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        const container = document.getElementById('hexagon-background');
        if (!container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas properties
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        container.appendChild(this.canvas);
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        this.ctx.scale(dpr, dpr);
        
        // Regenerate hexagons after resize
        this.generateHexagons();
    }
    
    generateHexagons() {
        this.hexagons = [];
        
        // Calcular espaçamento correto para padrão de colmeia
        const hexWidth = this.hexSize * 2;
        const hexHeight = this.hexSize * Math.sqrt(3);
        const horizontalSpacing = hexWidth * 0.75; // 3/4 da largura para encaixe perfeito
        const verticalSpacing = hexHeight; // Altura completa do hexágono
        
        const cols = Math.ceil(window.innerWidth / horizontalSpacing) + 3;
        const rows = Math.ceil(window.innerHeight / verticalSpacing) + 3;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Posicionamento correto para padrão de colmeia
                const x = col * horizontalSpacing - horizontalSpacing;
                const y = row * verticalSpacing + (col % 2) * (verticalSpacing / 2) - verticalSpacing;
                
                this.hexagons.push({
                    x: x,
                    y: y,
                    row: row,
                    col: col,
                    opacity: 0.1,
                    glowIntensity: 0,
                    baseOpacity: 0.02 + Math.random() * 0.05,
                    wavePhase: Math.random() * Math.PI * 2,
                    blinkTimer: 0,
                    isBlinking: false,
                    blinkIntensity: 0,
                    targetOpacity: 0.1,
                    currentOpacity: 0.1
                });
            }
        }
    }
    
    bindEvents() {
        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Touch events for mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });
        
        // Resize event
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Visibility change event for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.animate();
            }
        });
    }
    
    drawHexagon(x, y, size, opacity, glowIntensity) {
        if (!this.ctx) return;
        
        const ctx = this.ctx;
        
        // Calculate hexagon points
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            points.push({
                x: x + size * Math.cos(angle),
                y: y + size * Math.sin(angle)
            });
        }
        
        // Draw glow effect if intensity > 0
        if (glowIntensity > 0) {
            ctx.save();
            
            // Create radial gradient for glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
            gradient.addColorStop(0, `rgba(0, 255, 255, ${glowIntensity * 0.6})`);
            gradient.addColorStop(0.5, `rgba(0, 255, 255, ${glowIntensity * 0.3})`);
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
        
        // Draw hexagon outline
        ctx.save();
        
        // Calculate border intensity
        const borderIntensity = Math.min(opacity + glowIntensity, 1);
        
        // Draw hexagon path
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.closePath();
        
        // Draw normal border
        ctx.strokeStyle = `rgba(0, 255, 255, ${borderIntensity})`;
        ctx.lineWidth = 1 + (glowIntensity * 2);
        ctx.stroke();
        
        // Add glow effect only to the border if intensity is high enough
        if (glowIntensity > 0.05) {
            ctx.shadowColor = 'rgba(0, 255, 255, 0.3)';
            ctx.shadowBlur = 5 + (glowIntensity * 10);
            ctx.strokeStyle = `rgba(0, 255, 255, ${borderIntensity})`;
            ctx.lineWidth = 1 + (glowIntensity * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        ctx.restore();
    }
    
    updateHexagons() {
        this.time += this.waveSpeed;
        
        this.hexagons.forEach((hex, index) => {
            // Efeito Wave baseado na posição e tempo
            const waveX = hex.col * 0.3;
            const waveY = hex.row * 0.2;
            const waveIntensity = Math.sin(this.time + hex.wavePhase + waveX + waveY) * 0.15;
            
            // Distância do mouse para efeito de iluminação
            const dx = this.mouse.x - hex.x;
            const dy = this.mouse.y - hex.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Efeito de iluminação do mouse (mais suave)
            let mouseGlow = 0;
            if (distance < this.glowRadius) {
                const intensity = 1 - (distance / this.glowRadius);
                mouseGlow = intensity * this.maxGlowIntensity;
            }
            
            // Sistema de piscadas aleatórias
            if (!hex.isBlinking && Math.random() < this.blinkChance) {
                hex.isBlinking = true;
                hex.blinkTimer = 0;
                hex.blinkIntensity = 0.4 + Math.random() * 0.4;
            }
            
            // Atualizar piscada
            if (hex.isBlinking) {
                hex.blinkTimer += 0.1;
                const blinkCycle = Math.sin(hex.blinkTimer * 8) * hex.blinkIntensity * 0.5;
                hex.targetOpacity = hex.baseOpacity + Math.max(0, blinkCycle);
                
                if (hex.blinkTimer > Math.PI / 4) {
                    hex.isBlinking = false;
                    hex.targetOpacity = hex.baseOpacity;
                }
            } else {
                // Combinar wave e mouse glow (reduzido em 50%)
                hex.targetOpacity = hex.baseOpacity + Math.max(0, waveIntensity * 0.5) + mouseGlow;
            }
            
            // Suavizar transições
            hex.currentOpacity += (hex.targetOpacity - hex.currentOpacity) * 0.1;
            hex.opacity = Math.max(hex.currentOpacity, hex.baseOpacity * 0.5);
            hex.glowIntensity = Math.max(0, hex.currentOpacity - hex.baseOpacity);
        });
    }
    
    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Draw all hexagons
        this.hexagons.forEach(hex => {
            this.drawHexagon(hex.x, hex.y, this.hexSize, hex.opacity, hex.glowIntensity);
        });
    }
    
    animate() {
        this.updateHexagons();
        this.render();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.stopAnimation();
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('resize', this.handleResize);
        
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize when DOM is loaded
let hexagonBackground;

function initHexagonBackground() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        hexagonBackground = new HexagonBackground();
    } else {
        // Create a static version for users who prefer reduced motion
        const container = document.getElementById('hexagon-background');
        if (container) {
            container.style.background = 'radial-gradient(circle at center, #0f1419 0%, #0a0a0a 100%)';
            container.style.opacity = '0.5';
        }
    }
}

// Initialize on DOM content loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHexagonBackground);
} else {
    initHexagonBackground();
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (hexagonBackground) {
        if (document.hidden) {
            hexagonBackground.stopAnimation();
        } else {
            hexagonBackground.animate();
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (hexagonBackground) {
        hexagonBackground.destroy();
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexagonBackground;
}