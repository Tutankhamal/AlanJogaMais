/**
 * Hexagon Background Animation
 * Creates a dynamic hexagonal grid that reacts to mouse movement
 * with cyberpunk-style lighting effects
 * 
 * Desenvolvido por André "Tutankhamal" Borba
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
        
        // Sistema de efeito colorido interativo
        this.colorMode = false;
        this.colorTransition = 0; // 0 = modo normal, 1 = modo colorido completo
        this.colorTransitionSpeed = 0.05; // Aumentar velocidade de transição
        this.waveCenter = { x: 0, y: 0 };
        this.waveRadius = 0;
        this.maxWaveRadius = 800;
        this.waveSpeed = 3; // velocidade da onda em pixels por frame
        this.rainbowSpeed = 0.1; // Aumentar velocidade do arco-íris
        this.colorIntensity = 1.0;
        this.timeSpeed = 0.01; // velocidade do tempo para animações
        
        // Sistema de ondas de clique
        this.clickWaves = []; // Array para múltiplas ondas
        this.maxClickWaves = 5; // Máximo de ondas simultâneas
        this.clickWaveSpeed = 6; // Velocidade de expansão da onda (aumentada)
        this.clickWaveMaxRadius = Math.max(window.innerWidth, window.innerHeight) * 1.2; // Raio máximo baseado na tela
        this.clickWaveIntensity = 0.8; // Intensidade inicial da onda
        this.lastColorEffectTime = 0; // Para throttling do efeito colorido
        
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
                    isVisible: true, // Para culling
                    // Propriedades para efeito colorido interativo
                    colorPhase: Math.random() * Math.PI * 2, // Fase inicial aleatória
                    colorIntensity: 0,
                    waveDelay: Math.random() * Math.PI * 2,
                    baseColor: { r: 0, g: 150, b: 255 } // Cor base azul
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
        
        // Click event for wave effects (evitar conflitos com logos)
        document.addEventListener('click', (e) => {
            // Verificar se o clique não foi em uma logo
            const target = e.target;
            const isLogo = target.closest('.hero-logo') || target.closest('#nav-logo-effect');
            
            if (!isLogo) {
                this.createClickWave(e.clientX, e.clientY);
            }
        });
        
        // Touch events for mobile clicks
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.createClickWave(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
        
        // Resize event (debounced)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                this.regenerateHexagons(); // Recalcular hexágonos após resize
                // Atualizar raio máximo das ondas baseado no novo tamanho da tela
                this.clickWaveMaxRadius = Math.max(window.innerWidth, window.innerHeight) * 1.2;
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
    
    drawHexagon(x, y, size, opacity, glowIntensity, hexData = null) {
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
        
        // Determinar cores baseadas no modo colorido
        let strokeColor, glowColor;
        if (this.colorTransition > 0 && hexData) {
            // Modo colorido: usar cores RGB dinâmicas
            const colorIntensity = hexData.colorIntensity || 0;
            const time = performance.now() * 0.001;
            const phase = hexData.colorPhase + time * this.rainbowSpeed;
            
            // Cores do arco-íris mais vibrantes
            const r = Math.floor(128 + 127 * Math.sin(phase));
            const g = Math.floor(128 + 127 * Math.sin(phase + Math.PI * 2/3));
            const b = Math.floor(128 + 127 * Math.sin(phase + Math.PI * 4/3));
            
            // Aplicar intensidade baseada na onda com ajuste moderado
            const intensity = Math.min(1, colorIntensity * this.colorTransition * 1.8); // Intensidade moderada
            const finalR = Math.floor(hexData.baseColor.r + (r - hexData.baseColor.r) * intensity);
            const finalG = Math.floor(hexData.baseColor.g + (g - hexData.baseColor.g) * intensity);
            const finalB = Math.floor(hexData.baseColor.b + (b - hexData.baseColor.b) * intensity);
            
            // Opacidade moderada para equilibrar visual e legibilidade
            const colorOpacity = Math.max(glowIntensity * 0.2, intensity * 0.5);
            strokeColor = `rgba(${finalR}, ${finalG}, ${finalB}, ${colorOpacity})`;
            glowColor = `rgba(${finalR}, ${finalG}, ${finalB}, ${Math.max(glowIntensity * 0.3, intensity * 0.6)})`;
        } else {
            // Modo normal
            strokeColor = `rgba(118, 231, 255, ${glowIntensity * 0.3})`;
            glowColor = `rgba(118, 231, 255, ${glowIntensity * 0.4})`;
        }
        
        // Draw glow effect apenas se significativo e no modo high performance
        if (glowIntensity > 0.02 && this.performanceMode === 'high') {
            ctx.save();
            
            // Glow simplificado
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = size * glowIntensity * 2;
            
            // Draw hexagon path para glow
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.closePath();
            
            ctx.strokeStyle = strokeColor;
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
        
        // Determinar cor do contorno
        let borderColor;
        if (this.colorTransition > 0 && hexData) {
            const colorIntensity = hexData.colorIntensity || 0;
            const time = performance.now() * 0.001;
            const phase = hexData.colorPhase + time * this.rainbowSpeed;
            
            // Cores do arco-íris para o contorno
            const r = Math.floor(128 + 127 * Math.sin(phase));
            const g = Math.floor(128 + 127 * Math.sin(phase + Math.PI * 2/3));
            const b = Math.floor(128 + 127 * Math.sin(phase + Math.PI * 4/3));
            
            // Aplicar intensidade baseada na onda com ajuste moderado
            const intensity = Math.min(1, colorIntensity * this.colorTransition * 2.2); // Intensidade moderada
            const finalR = Math.floor(hexData.baseColor.r + (r - hexData.baseColor.r) * intensity);
            const finalG = Math.floor(hexData.baseColor.g + (g - hexData.baseColor.g) * intensity);
            const finalB = Math.floor(hexData.baseColor.b + (b - hexData.baseColor.b) * intensity);
            
            borderColor = `rgba(${finalR}, ${finalG}, ${finalB}, ${Math.max(borderIntensity, intensity * 0.5)})`;
        } else {
            borderColor = `rgba(118, 231, 255, ${borderIntensity})`;
        }
        
        // Draw normal border (otimizado)
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1 + (glowIntensity * 1.5); // Reduzido multiplicador
        ctx.stroke();
        
        ctx.restore();
    }
    

    
    updateHexagons() {
        this.time += this.timeSpeed;
        
        // Atualizar transição de cores
        if (this.colorMode && this.colorTransition < 1) {
            this.colorTransition = Math.min(1, this.colorTransition + this.colorTransitionSpeed);
        } else if (!this.colorMode && this.colorTransition > 0) {
            this.colorTransition = Math.max(0, this.colorTransition - this.colorTransitionSpeed);
        }
        
        // Onda de cores desabilitada - usando apenas ondas de clique otimizadas
        // if (this.colorMode && this.waveRadius < this.maxWaveRadius) {
        //     this.waveRadius += this.waveSpeed;
        // }
        
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
            
            // Efeito das ondas de clique
            let clickWaveGlow = 0;
            this.clickWaves.forEach(wave => {
                const clickDx = hex.x - wave.x;
                const clickDy = hex.y - wave.y;
                const clickDistance = Math.sqrt(clickDx * clickDx + clickDy * clickDy);
                
                // Calcular se o hexágono está na área da onda
                const waveThickness = 40; // Espessura da onda
                const distanceFromWaveEdge = Math.abs(clickDistance - wave.radius);
                
                if (distanceFromWaveEdge < waveThickness) {
                    const waveIntensity = (1 - distanceFromWaveEdge / waveThickness) * wave.intensity;
                    clickWaveGlow = Math.max(clickWaveGlow, waveIntensity * 0.6);
                }
            });
            
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
                // Combinar wave, mouse glow e click wave glow (intensificado)
                hex.targetOpacity = hex.baseOpacity + Math.max(0, waveIntensity * 0.5) + mouseGlow * 1.5 + clickWaveGlow;
            }
            
            // Calcular efeito colorido se ativo
            // Onda de cores desabilitada - usando apenas ondas de clique
            // if (this.colorTransition > 0) {
            //     const distanceToWaveCenter = Math.sqrt(
            //         Math.pow(hex.x - this.waveCenter.x, 2) + 
            //         Math.pow(hex.y - this.waveCenter.y, 2)
            //     );
            //     
            //     // Efeito de onda circular mais amplo e visível
            //     const waveDistance = Math.abs(distanceToWaveCenter - this.waveRadius);
            //     const waveWidth = 200; // Largura da onda ainda maior
            //     
            //     if (waveDistance < waveWidth) {
            //         const waveIntensity = (1 - waveDistance / waveWidth) * this.colorTransition;
            //         hex.colorIntensity = Math.max(hex.colorIntensity || 0, waveIntensity * 0.8); // Reduzir intensidade
            //     } else {
            //         // Decaimento mais lento para manter o efeito visível por mais tempo
            //         hex.colorIntensity = (hex.colorIntensity || 0) * 0.95;
            //     }
            //     
            //     // Garantir intensidade mínima quando o modo está ativo (reduzida)
            //     if (this.colorMode) {
            //         hex.colorIntensity = Math.max(hex.colorIntensity || 0, 0.15);
            //     }
            // }
            
            // Aplicar efeito de cor das ondas de clique
            if (this.colorMode) {
                // Garantir intensidade mínima quando o modo colorido está ativo
                hex.colorIntensity = Math.max(hex.colorIntensity || 0, 0.15);
                
                // Adicionar efeito de cor das ondas de clique no modo colorido
                this.clickWaves.forEach(wave => {
                    const clickDx = hex.x - wave.x;
                    const clickDy = hex.y - wave.y;
                    const clickDistance = Math.sqrt(clickDx * clickDx + clickDy * clickDy);
                    
                    const waveThickness = 60; // Espessura maior para efeito de cor
                    const distanceFromWaveEdge = Math.abs(clickDistance - wave.radius);
                    
                    if (distanceFromWaveEdge < waveThickness) {
                        const waveColorIntensity = (1 - distanceFromWaveEdge / waveThickness) * wave.intensity * 0.8;
                        hex.colorIntensity = Math.max(hex.colorIntensity || 0, waveColorIntensity);
                    }
                });
                
                // Limitar intensidade máxima
                hex.colorIntensity = Math.min(hex.colorIntensity || 0, 1);
            } else {
                // Mesmo no modo padrão, aplicar efeito de cor sutil das ondas de clique
                let clickColorIntensity = 0;
                this.clickWaves.forEach(wave => {
                    const clickDx = hex.x - wave.x;
                    const clickDy = hex.y - wave.y;
                    const clickDistance = Math.sqrt(clickDx * clickDx + clickDy * clickDy);
                    
                    const waveThickness = 50;
                    const distanceFromWaveEdge = Math.abs(clickDistance - wave.radius);
                    
                    if (distanceFromWaveEdge < waveThickness) {
                        const waveColorIntensity = (1 - distanceFromWaveEdge / waveThickness) * wave.intensity * 0.3;
                        clickColorIntensity = Math.max(clickColorIntensity, waveColorIntensity);
                    }
                });
                
                hex.colorIntensity = clickColorIntensity;
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
            this.drawHexagon(hex.x, hex.y, hexSize, hex.opacity, hex.glowIntensity, hex);
        });
    }
    
    animate() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        
        // Limitar FPS
        if (deltaTime >= this.frameInterval) {
            this.updateHexagons();
            this.updateClickWaves(deltaTime); // Atualizar ondas de clique com deltaTime
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
    
    activateColorEffect(centerX, centerY) {
        // Throttling para evitar cliques muito rápidos
        const now = performance.now();
        if (this.lastColorEffectTime && now - this.lastColorEffectTime < 300) {
            return; // Ignorar cliques muito rápidos
        }
        this.lastColorEffectTime = now;
        
        // Toggle do modo colorido
        this.colorMode = !this.colorMode;
        
        if (this.colorMode) {
            // Converter coordenadas da tela para coordenadas do canvas
            const rect = this.canvas.getBoundingClientRect();
            this.waveCenter.x = centerX - rect.left;
            this.waveCenter.y = centerY - rect.top;
            this.waveRadius = 0;
            
            // Randomizar fases de cor de forma otimizada (apenas hexágonos visíveis)
            this.visibleHexagons.forEach(hex => {
                hex.colorPhase = Math.random() * Math.PI * 2;
            });
            
            console.log('Efeito colorido ativado em:', this.waveCenter);
        } else {
            // Resetar intensidades de cor de forma otimizada (apenas hexágonos visíveis)
            this.visibleHexagons.forEach(hex => {
                hex.colorIntensity = 0;
            });
            
            console.log('Efeito colorido desativado');
        }
    }
    
    createClickWave(x, y) {
        // Remover ondas antigas se exceder o limite
        if (this.clickWaves.length >= this.maxClickWaves) {
            this.clickWaves.shift(); // Remove a onda mais antiga
        }
        
        // Criar nova onda
        const wave = {
            x: x,
            y: y,
            radius: 0,
            intensity: this.clickWaveIntensity,
            maxRadius: this.clickWaveMaxRadius,
            speed: this.clickWaveSpeed,
            startTime: performance.now()
        };
        
        this.clickWaves.push(wave);
    }
    
    updateClickWaves(deltaTime = 16) {
        // Atualizar todas as ondas de clique
        for (let i = this.clickWaves.length - 1; i >= 0; i--) {
            const wave = this.clickWaves[i];
            
            // Expandir a onda com base no deltaTime para suavidade
            const speedMultiplier = deltaTime / 16; // Normalizar para 60fps
            wave.radius += wave.speed * speedMultiplier;
            
            // Reduzir intensidade conforme a onda se expande com curva suave
            const progress = Math.min(wave.radius / wave.maxRadius, 1);
            wave.intensity = this.clickWaveIntensity * Math.pow(1 - progress, 2); // Curva quadrática para fade suave
            
            // Remover onda se ela atingiu o raio máximo
            if (wave.radius >= wave.maxRadius) {
                this.clickWaves.splice(i, 1);
            }
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

// Adicionar event listener para a logo da hero section
function setupHeroLogoInteraction() {
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo && hexagonBackground) {
        heroLogo.addEventListener('click', function(event) {
            // Usar centro da tela para a onda
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Ativar efeito colorido
            hexagonBackground.activateColorEffect(centerX, centerY);
            
            // Criar onda de clique no centro da tela
            hexagonBackground.createClickWave(centerX, centerY);
            
            // Adicionar feedback visual na logo
            heroLogo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                heroLogo.style.transform = '';
            }, 200);
        });
        
        // Adicionar cursor pointer para indicar interatividade
        heroLogo.style.cursor = 'pointer';
        heroLogo.title = 'Clique para ativar efeito colorido no background';
    }
}

// Adicionar event listener para a logo da navbar
function setupNavLogoInteraction() {
    const navLogo = document.querySelector('#nav-logo-effect');
    if (navLogo && hexagonBackground) {
        navLogo.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Usar centro da tela para a onda
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Ativar efeito colorido
            hexagonBackground.activateColorEffect(centerX, centerY);
            
            // Criar onda de clique no centro da tela
            hexagonBackground.createClickWave(centerX, centerY);
            
            // Adicionar feedback visual na logo
            navLogo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                navLogo.style.transform = '';
            }, 200);
        });
        
        // Adicionar cursor pointer para indicar interatividade
        navLogo.style.cursor = 'pointer';
        navLogo.title = 'Clique para ativar efeito colorido no background';
    }
}

// Setup da interação após inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            setupHeroLogoInteraction();
            setupNavLogoInteraction();
        }, 100); // Pequeno delay para garantir inicialização
    });
} else {
    setTimeout(() => {
        setupHeroLogoInteraction();
        setupNavLogoInteraction();
    }, 100);
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