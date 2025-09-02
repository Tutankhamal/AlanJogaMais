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
        this.visibleHexagons = [];
        this.mouse = { x: 0, y: 0 };
        this.lastMouseUpdate = 0;
        this.animationId = null;
        this.hexSize = 30;
        this.hexSpacing = 60;
        this.glowRadius = 250; // Aumentado para maior área de efeito
        this.maxGlowIntensity = 0.12; // Aumentado para maior intensidade no hover
        this.waveSpeed = 0.003; // Reduzido para menos cálculos
        this.time = 0;
        this.blinkChance = 0.0002; // Reduzido para menos piscadas
        
        // Performance settings
        this.lastFrameTime = 0;
        this.targetFPS = 30; // Limitado a 30 FPS
        this.frameInterval = 1000 / this.targetFPS;
        this.mouseThrottleDelay = 16; // ~60fps para mouse
        this.performanceMode = this.detectPerformanceMode();
        
        // Performance monitoring
        this.frameCount = 0;
        this.fpsHistory = [];
        this.lastFPSCheck = 0;
        this.performanceCheckInterval = 2000; // Check every 2 seconds
        this.lowFPSThreshold = 20;
        this.autoOptimizationEnabled = true;
        
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
    
    detectPerformanceMode() {
        const screenArea = window.innerWidth * window.innerHeight;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile || screenArea > 3686400) { // > 2560x1440 (1440p)
            return 'low';
        } else if (screenArea > 2073600) { // > 1920x1080 (1080p)
            return 'medium';
        }
        return 'high';
    }
    
    generateHexagons() {
        this.hexagons = [];
        
        // Calcular espaçamento matemático correto para padrão hexagonal perfeito
        const hexWidth = this.hexSize * 2;
        const hexHeight = this.hexSize * Math.sqrt(3);
        // Espaçamento horizontal correto: 3/4 da largura do hexágono
        const horizontalSpacing = this.hexSize * 1.5; // 3/2 * hexSize para simetria perfeita
        // Espaçamento vertical correto: altura completa do hexágono
        const verticalSpacing = hexHeight;
        
        // Reduzir densidade baseado no modo de performance
        let densityMultiplier = 1;
        if (this.performanceMode === 'low') {
            densityMultiplier = 0.5; // 50% menos hexágonos
        } else if (this.performanceMode === 'medium') {
            densityMultiplier = 0.75; // 25% menos hexágonos
        }
        
        const adjustedHorizontalSpacing = horizontalSpacing / densityMultiplier;
        const adjustedVerticalSpacing = verticalSpacing / densityMultiplier;
        
        // Calcular quantidade com margem extra para cobertura completa
        const extraMargin = this.hexSize * 2; // Margem extra baseada no tamanho do hexágono
        const cols = Math.ceil((window.innerWidth + extraMargin * 2) / adjustedHorizontalSpacing) + 3;
        const rows = Math.ceil((window.innerHeight + extraMargin * 2) / adjustedVerticalSpacing) + 3;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Posicionamento matemático correto para padrão hexagonal
                const x = col * adjustedHorizontalSpacing - extraMargin;
                const y = row * adjustedVerticalSpacing + (col % 2) * (adjustedVerticalSpacing / 2) - extraMargin;
                
                this.hexagons.push({
                    x: x,
                    y: y,
                    row: row,
                    col: col,
                    opacity: 0.1,
                    glowIntensity: 0,
                    baseOpacity: 0.02 + Math.random() * 0.03, // Reduzido range
                    wavePhase: Math.random() * Math.PI * 2,
                    blinkTimer: 0,
                    isBlinking: false,
                    blinkIntensity: 0,
                    targetOpacity: 0.1,
                    currentOpacity: 0.1,
                    isVisible: true // Para culling
                });
            }
        }
    }
    
    bindEvents() {
        // Throttled mouse move event
        document.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (now - this.lastMouseUpdate > this.mouseThrottleDelay) {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.lastMouseUpdate = now;
            }
        });
        
        // Touch events for mobile (também throttled)
        document.addEventListener('touchmove', (e) => {
            const now = performance.now();
            if (now - this.lastMouseUpdate > this.mouseThrottleDelay && e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
                this.lastMouseUpdate = now;
            }
        });
        
        // Resize event (debounced)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                this.regenerateHexagons(); // Recalcular hexágonos após resize
            }, 250);
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
        
        // Otimização: pular hexágonos muito transparentes
        if (opacity < 0.01 && glowIntensity < 0.01) return;
        
        // Calculate hexagon points (cache para performance)
        if (!this.hexagonPoints) {
            this.hexagonPoints = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                this.hexagonPoints.push({
                    cos: Math.cos(angle),
                    sin: Math.sin(angle)
                });
            }
        }
        
        const points = this.hexagonPoints.map(p => ({
            x: x + size * p.cos,
            y: y + size * p.sin
        }));
        
        // Draw glow effect apenas se significativo e no modo high performance
        if (glowIntensity > 0.02 && this.performanceMode === 'high') {
            ctx.save();
            
            // Glow simplificado
            ctx.shadowColor = `rgba(0, 255, 255, ${glowIntensity * 0.4})`;
            ctx.shadowBlur = size * glowIntensity * 2;
            
            // Draw hexagon path para glow
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.closePath();
            
            ctx.strokeStyle = `rgba(0, 255, 255, ${glowIntensity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.restore();
        }
        
        // Draw hexagon outline
        ctx.save();
        
        // Calculate border intensity
        const borderIntensity = Math.min(opacity + glowIntensity * 0.5, 1);
        
        // Draw hexagon path
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.closePath();
        
        // Draw normal border (otimizado)
        ctx.strokeStyle = `rgba(0, 255, 255, ${borderIntensity})`;
        ctx.lineWidth = 1 + (glowIntensity * 1.5); // Reduzido multiplicador
        ctx.stroke();
        
        ctx.restore();
    }
    
    updateHexagons() {
        this.time += this.waveSpeed;
        
        // Viewport culling - apenas processar hexágonos visíveis
        const margin = this.hexSize * 3; // Margem para suavizar entrada/saída
        this.visibleHexagons = this.hexagons.filter(hex => {
            hex.isVisible = hex.x > -margin && hex.x < window.innerWidth + margin &&
                           hex.y > -margin && hex.y < window.innerHeight + margin;
            return hex.isVisible;
        });
        
        this.visibleHexagons.forEach((hex, index) => {
            // Efeito Wave baseado na posição e tempo
            const waveX = hex.col * 0.3;
            const waveY = hex.row * 0.2;
            const waveIntensity = Math.sin(this.time + hex.wavePhase + waveX + waveY) * 0.15;
            
            // Distância do mouse para efeito de iluminação
            const dx = this.mouse.x - hex.x;
            const dy = this.mouse.y - hex.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Efeito de iluminação do mouse (intensificado)
            let mouseGlow = 0;
            if (distance < this.glowRadius) {
                const intensity = 1 - (distance / this.glowRadius);
                // Curva mais acentuada para efeito mais dramático
                const enhancedIntensity = Math.pow(intensity, 0.7);
                mouseGlow = enhancedIntensity * this.maxGlowIntensity;
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
                // Combinar wave e mouse glow (intensificado)
                hex.targetOpacity = hex.baseOpacity + Math.max(0, waveIntensity * 0.5) + mouseGlow * 1.5;
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
        
        // Draw apenas hexágonos visíveis
        this.visibleHexagons.forEach(hex => {
            this.drawHexagon(hex.x, hex.y, this.hexSize, hex.opacity, hex.glowIntensity);
        });
    }
    
    animate() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        
        // Limitar FPS
        if (deltaTime >= this.frameInterval) {
            this.updateHexagons();
            this.render();
            this.lastFrameTime = now - (deltaTime % this.frameInterval);
            
            // Performance monitoring
            this.monitorPerformance(now, deltaTime);
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    monitorPerformance(now, deltaTime) {
        this.frameCount++;
        
        // Calculate FPS every 2 seconds
        if (now - this.lastFPSCheck > this.performanceCheckInterval) {
            const currentFPS = this.frameCount / (this.performanceCheckInterval / 1000);
            this.fpsHistory.push(currentFPS);
            
            // Keep only last 5 measurements
            if (this.fpsHistory.length > 5) {
                this.fpsHistory.shift();
            }
            
            // Auto-optimization based on performance
            if (this.autoOptimizationEnabled && this.fpsHistory.length >= 3) {
                const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
                
                if (avgFPS < this.lowFPSThreshold && this.performanceMode !== 'low') {
                    console.log(`[HexagonBackground] Low FPS detected (${avgFPS.toFixed(1)}), switching to low performance mode`);
                    this.degradePerformance();
                } else if (avgFPS > this.lowFPSThreshold * 1.5 && this.performanceMode === 'low') {
                    console.log(`[HexagonBackground] Performance improved (${avgFPS.toFixed(1)}), switching to medium performance mode`);
                    this.improvePerformance();
                }
            }
            
            this.frameCount = 0;
            this.lastFPSCheck = now;
        }
    }
    
    degradePerformance() {
        if (this.performanceMode === 'high') {
            this.performanceMode = 'medium';
            this.targetFPS = 25;
        } else if (this.performanceMode === 'medium') {
            this.performanceMode = 'low';
            this.targetFPS = 20;
            this.maxGlowIntensity *= 0.5; // Reduzir ainda mais o glow
        }
        
        this.frameInterval = 1000 / this.targetFPS;
        this.regenerateHexagons();
    }
    
    improvePerformance() {
        if (this.performanceMode === 'low') {
            this.performanceMode = 'medium';
            this.targetFPS = 25;
            this.maxGlowIntensity *= 2; // Restaurar glow
        } else if (this.performanceMode === 'medium') {
            this.performanceMode = 'high';
            this.targetFPS = 30;
        }
        
        this.frameInterval = 1000 / this.targetFPS;
        this.regenerateHexagons();
    }
    
    regenerateHexagons() {
        // Regenerar hexágonos com nova densidade
        this.generateHexagons();
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