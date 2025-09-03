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
        
        // Sistema de densidade adaptativa
        this.adaptiveDensity = {
            enabled: true,
            currentLevel: 1.0, // 1.0 = densidade completa
            targetLevel: 1.0,
            adjustmentSpeed: 0.02, // Velocidade de ajuste suave
            minLevel: 0.3, // Densidade mínima (30%)
            maxLevel: 1.0, // Densidade máxima (100%)
            lastAdjustment: 0
        };
        
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
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Detecção mais inteligente considerando múltiplos fatores
        let performanceScore = 100; // Começar com pontuação alta
        
        // Penalizar dispositivos móveis
        if (isMobile || isTouch) {
            performanceScore -= 40;
        }
        
        // Penalizar telas muito grandes (mais pixels para renderizar)
        if (screenArea > 3686400) { // > 2560x1440
            performanceScore -= 30;
        } else if (screenArea > 2073600) { // > 1920x1080
            performanceScore -= 15;
        }
        
        // Penalizar pixel ratio alto (telas retina)
        if (pixelRatio > 2) {
            performanceScore -= 20;
        } else if (pixelRatio > 1.5) {
            performanceScore -= 10;
        }
        
        // Verificar memória disponível se possível
        if (navigator.deviceMemory && navigator.deviceMemory < 4) {
            performanceScore -= 25;
        }
        
        // Verificar número de cores do processador
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            performanceScore -= 15;
        }
        
        // Determinar modo baseado na pontuação
        if (performanceScore < 40) {
            return 'low';
        } else if (performanceScore < 70) {
            return 'medium';
        }
        return 'high';
    }
    
    generateHexagons() {
        this.hexagons = [];
        
        // Detectar se é dispositivo móvel para aplicar correções específicas
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         'ontouchstart' in window || 
                         window.innerWidth <= 768;
        
        // Calcular espaçamento matemático correto para padrão hexagonal perfeito
        const hexWidth = this.hexSize * 2;
        const hexHeight = this.hexSize * Math.sqrt(3);
        
        // Espaçamento horizontal correto: 3/4 da largura do hexágono (padrão matemático hexagonal)
        const horizontalSpacing = this.hexSize * 1.5;
        // Espaçamento vertical correto: altura completa do hexágono
        const verticalSpacing = hexHeight;
        
        // CORREÇÃO MOBILE: Estratégia diferenciada para dispositivos móveis
        let effectiveHexSize = this.hexSize;
        let skipPattern = 1; // Renderizar todos os hexágonos por padrão
        let useAdaptiveDensity = true;
        
        if (isMobile) {
            // Em mobile, priorizar cobertura completa sobre performance
            effectiveHexSize = this.hexSize * 0.7; // Hexágonos menores para melhor performance
            skipPattern = 1; // SEMPRE renderizar todos para evitar lacunas
            useAdaptiveDensity = false; // Desabilitar densidade adaptativa em mobile
            console.log('[HexagonBackground] Modo mobile detectado - priorizando cobertura completa');
        } else {
            // Desktop: usar estratégia de otimização normal
            if (this.performanceMode === 'low') {
                effectiveHexSize = this.hexSize * 0.8;
                skipPattern = 2;
            } else if (this.performanceMode === 'medium') {
                effectiveHexSize = this.hexSize * 0.9;
                skipPattern = 1;
            }
        }
        
        // Atualizar configuração de densidade adaptativa
        this.adaptiveDensity.enabled = useAdaptiveDensity;
        
        // Recalcular espaçamentos com tamanho efetivo
        const effectiveHorizontalSpacing = effectiveHexSize * 1.5;
        const effectiveVerticalSpacing = effectiveHexSize * Math.sqrt(3);
        
        // CORREÇÃO: Margem extra maior para mobile para garantir cobertura nas bordas
        const baseMargin = effectiveHexSize * 3;
        const extraMargin = isMobile ? baseMargin * 1.5 : baseMargin; // 50% mais margem em mobile
        
        // Calcular quantidade com margem extra para cobertura completa
        const cols = Math.ceil((window.innerWidth + extraMargin * 2) / effectiveHorizontalSpacing) + (isMobile ? 6 : 4);
        const rows = Math.ceil((window.innerHeight + extraMargin * 2) / effectiveVerticalSpacing) + (isMobile ? 6 : 4);
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Skip pattern para otimização (mantém simetria)
                // Em mobile, sempre renderizar para evitar lacunas
                if (!isMobile) {
                    const densityCheck = this.shouldRenderHexagon(row, col, skipPattern);
                    if (!densityCheck) {
                        continue;
                    }
                }
                
                // Posicionamento matemático correto para padrão hexagonal
                let x = col * effectiveHorizontalSpacing - extraMargin;
                let y = row * effectiveVerticalSpacing + (col % 2) * (effectiveVerticalSpacing / 2) - extraMargin;
                
                // CORREÇÃO MOBILE: Ajustar posicionamento para garantir cobertura nas bordas
                if (isMobile) {
                    // Pequeno ajuste para garantir que hexágonos nas bordas cubram completamente
                    const edgeAdjustment = effectiveHexSize * 0.1;
                    
                    // Ajustar hexágonos próximos às bordas
                    if (col === 0) x -= edgeAdjustment; // Borda esquerda
                    if (row === 0) y -= edgeAdjustment; // Borda superior
                    if (col === cols - 1) x += edgeAdjustment; // Borda direita
                    if (row === rows - 1) y += edgeAdjustment; // Borda inferior
                }
                
                this.hexagons.push({
                    x: x,
                    y: y,
                    row: row,
                    col: col,
                    size: effectiveHexSize, // Tamanho individual do hexágono
                    opacity: 0.1,
                    glowIntensity: 0,
                    baseOpacity: 0.02 + Math.random() * 0.03,
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
        
        // Viewport culling melhorado - garantir cobertura completa sem lacunas
        // CORREÇÃO: Margem mais generosa para mobile para evitar lacunas
        const isMobile = window.innerWidth <= 768;
        const baseDynamicMargin = Math.max(this.hexSize * 4, 100);
        const mobileMultiplier = isMobile ? 1.8 : 1.0; // 80% mais margem em mobile
        const margin = baseDynamicMargin * mobileMultiplier;
        
        this.visibleHexagons = this.hexagons.filter(hex => {
            const hexSize = hex.size || this.hexSize;
            // Usar margem baseada no tamanho individual do hexágono
            const dynamicMargin = hexSize * 2 * mobileMultiplier;
            hex.isVisible = hex.x > -margin - dynamicMargin && 
                           hex.x < window.innerWidth + margin + dynamicMargin &&
                           hex.y > -margin - dynamicMargin && 
                           hex.y < window.innerHeight + margin + dynamicMargin;
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
            // Usar o tamanho individual do hexágono se disponível, senão usar o padrão
            const hexSize = hex.size || this.hexSize;
            this.drawHexagon(hex.x, hex.y, hexSize, hex.opacity, hex.glowIntensity);
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
                
                // Atualizar densidade adaptativa
                this.updateAdaptiveDensity(avgFPS);
                
                // Otimização de modo de performance (menos agressiva)
                if (avgFPS < this.lowFPSThreshold * 0.7 && this.performanceMode !== 'low') {
                    console.log(`[HexagonBackground] Low FPS detected (${avgFPS.toFixed(1)}), switching to low performance mode`);
                    this.degradePerformance();
                } else if (avgFPS > this.lowFPSThreshold * 1.8 && this.performanceMode === 'low') {
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
            console.log('[HexagonBackground] Degradando para modo medium');
        } else if (this.performanceMode === 'medium') {
            this.performanceMode = 'low';
            this.targetFPS = 20;
            this.maxGlowIntensity *= 0.5; // Reduzir ainda mais o glow
            this.waveSpeed *= 0.5; // Reduzir velocidade da animação
            console.log('[HexagonBackground] Degradando para modo low');
        }
        
        this.frameInterval = 1000 / this.targetFPS;
        this.regenerateHexagons();
    }
    
    improvePerformance() {
        if (this.performanceMode === 'low') {
            this.performanceMode = 'medium';
            this.targetFPS = 25;
            this.maxGlowIntensity *= 2; // Restaurar glow
            this.waveSpeed *= 2; // Restaurar velocidade da animação
            console.log('[HexagonBackground] Melhorando para modo medium');
        } else if (this.performanceMode === 'medium') {
            this.performanceMode = 'high';
            this.targetFPS = 30;
            console.log('[HexagonBackground] Melhorando para modo high');
        }
        
        this.frameInterval = 1000 / this.targetFPS;
        this.regenerateHexagons();
    }
    
    shouldRenderHexagon(row, col, baseSkipPattern) {
        // Skip pattern básico
        if (baseSkipPattern > 1 && (row + col) % baseSkipPattern !== 0) {
            return false;
        }
        
        // Densidade adaptativa - usar padrão determinístico para manter simetria
        // CORREÇÃO: Aplicar apenas se não for mobile e estiver habilitada
        if (this.adaptiveDensity.enabled && this.adaptiveDensity.currentLevel < 1.0) {
            // Verificar se é mobile para evitar aplicar densidade adaptativa
            const isMobile = window.innerWidth <= 768 || 
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (!isMobile) {
                // Criar padrão baseado em hash da posição para consistência
                const hash = (row * 73 + col * 37) % 100;
                const threshold = this.adaptiveDensity.currentLevel * 100;
                return hash < threshold;
            }
        }
        
        return true;
    }
    
    updateAdaptiveDensity(currentFPS) {
        if (!this.adaptiveDensity.enabled) return;
        
        const now = performance.now();
        
        // Ajustar densidade baseado no FPS
        if (currentFPS < this.lowFPSThreshold) {
            // FPS baixo - reduzir densidade
            this.adaptiveDensity.targetLevel = Math.max(
                this.adaptiveDensity.minLevel,
                this.adaptiveDensity.targetLevel - 0.1
            );
        } else if (currentFPS > this.lowFPSThreshold * 1.5) {
            // FPS bom - aumentar densidade gradualmente
            this.adaptiveDensity.targetLevel = Math.min(
                this.adaptiveDensity.maxLevel,
                this.adaptiveDensity.targetLevel + 0.05
            );
        }
        
        // Suavizar transição de densidade
        const diff = this.adaptiveDensity.targetLevel - this.adaptiveDensity.currentLevel;
        if (Math.abs(diff) > 0.01) {
            this.adaptiveDensity.currentLevel += diff * this.adaptiveDensity.adjustmentSpeed;
            
            // Regenerar hexágonos se mudança significativa
            if (Math.abs(diff) > 0.1 && now - this.adaptiveDensity.lastAdjustment > 1000) {
                this.regenerateHexagons();
                this.adaptiveDensity.lastAdjustment = now;
                console.log(`[HexagonBackground] Densidade adaptativa: ${(this.adaptiveDensity.currentLevel * 100).toFixed(1)}%`);
            }
        }
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