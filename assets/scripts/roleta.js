/**
 * Roleta Compacta - Sistema de Sorteios com Estética Cyberpunk
 * Desenvolvido para o projeto AlanJogaMais
 */

class RoletaCompacta {
    constructor() {
        this.nomes = [];
        this.isRunning = false;
        this.isPaused = false;
        this.currentAnimation = null;
        this.tempoSorteio = 30; // segundos
        this.audioFundo = null;
        this.audioFinal = null;
        this.volumeFundo = 0.5;
        this.volumeFinal = 0.8;
        this.startTime = null;
        this.pausedTime = 0;
        this.matrixChars = [];
        
        this.initializeElements();
        this.bindEvents();
        this.updateTimeValue();
    }
    
    initializeElements() {
        // Elementos principais
        this.displayElement = document.getElementById('roletaDisplay');
        this.messageElement = document.getElementById('roletaMessage');
        this.iniciarBtn = document.getElementById('iniciarBtn');
        this.pausarBtn = document.getElementById('pausarBtn');
        
        // Configurações
        this.listaTextos = document.getElementById('listaTextos');
        this.contadorLinhas = document.getElementById('contadorLinhas');
        this.tempoSorteioSelect = document.getElementById('tempoSorteio');
        
        // Áudios
        this.audioFundoInput = document.getElementById('audioFundo');
        this.audioFinalInput = document.getElementById('audioFinal');
        this.audioFundoInfo = document.getElementById('audioFundoInfo');
        this.audioFinalInfo = document.getElementById('audioFinalInfo');
        
        // Volumes
        this.volumeFundoRange = document.getElementById('volumeFundo');
        this.volumeFinalRange = document.getElementById('volumeFinal');
        this.volumeFundoValue = document.getElementById('volumeFundoValue');
        this.volumeFinalValue = document.getElementById('volumeFinalValue');
    }
    
    bindEvents() {
        // Botões principais
        this.iniciarBtn.addEventListener('click', () => this.iniciarSorteio());
        this.pausarBtn.addEventListener('click', () => this.pausarSorteio());
        
        // Lista de textos
        this.listaTextos.addEventListener('input', () => this.updateNomes());
        this.listaTextos.addEventListener('paste', () => {
            setTimeout(() => this.updateNomes(), 10);
        });
        
        // Tempo do sorteio
        this.tempoSorteioSelect.addEventListener('change', () => this.updateTimeValue());
        
        // Upload de áudios
        this.audioFundoInput.addEventListener('change', (e) => this.handleAudioUpload(e, 'fundo'));
        this.audioFinalInput.addEventListener('change', (e) => this.handleAudioUpload(e, 'final'));
        
        // Controles de volume
        this.volumeFundoRange.addEventListener('input', () => this.updateVolume('fundo'));
        this.volumeFinalRange.addEventListener('input', () => this.updateVolume('final'));
    }
    
    updateNomes() {
        const texto = this.listaTextos.value.trim();
        this.nomes = texto ? texto.split('\n').filter(nome => nome.trim() !== '') : [];
        
        // Atualizar contador
        const count = this.nomes.length;
        this.contadorLinhas.textContent = `${count} linha${count !== 1 ? 's' : ''}`;
        
        // Atualizar caracteres únicos para animação matrix
        this.updateMatrixChars();
        
        // Habilitar/desabilitar botão iniciar
        this.iniciarBtn.disabled = count === 0 || this.isRunning;
        
        // Atualizar mensagem se não estiver rodando
        if (!this.isRunning) {
            if (count === 0) {
                this.messageElement.innerHTML = '<span class="glitch-text">AGUARDANDO NOMES</span>';
            } else {
                this.messageElement.innerHTML = `<span class="glitch-text">PRONTO! ${count} LINHA${count !== 1 ? 'S' : ''}</span>`;
            }
        }
    }
    
    updateMatrixChars() {
        const allChars = new Set();
        this.nomes.forEach(nome => {
            for (let char of nome.toLowerCase()) {
                if (char.match(/[a-záàâãéèêíìîóòôõúùûç\s]/)) {
                    allChars.add(char);
                }
            }
        });
        this.matrixChars = Array.from(allChars);
    }
    
    updateTimeValue() {
        this.tempoSorteio = parseInt(this.tempoSorteioSelect.value);
    }
    
    handleAudioUpload(event, type) {
        const file = event.target.files[0];
        const infoElement = type === 'fundo' ? this.audioFundoInfo : this.audioFinalInfo;
        
        if (file) {
            if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
                const audio = new Audio();
                audio.src = URL.createObjectURL(file);
                
                if (type === 'fundo') {
                    this.audioFundo = audio;
                    this.audioFundo.loop = true;
                    this.audioFundo.volume = this.volumeFundo;
                } else {
                    this.audioFinal = audio;
                    this.audioFinal.volume = this.volumeFinal;
                }
                
                infoElement.textContent = file.name;
                infoElement.style.color = 'var(--accent-color)';
            } else {
                infoElement.textContent = 'Formato inválido. Use apenas MP3.';
                infoElement.style.color = '#ff4500';
                event.target.value = '';
            }
        } else {
            infoElement.textContent = 'Nenhum arquivo selecionado';
            infoElement.style.color = 'rgba(255, 255, 255, 0.6)';
            
            if (type === 'fundo') {
                this.audioFundo = null;
            } else {
                this.audioFinal = null;
            }
        }
    }
    
    updateVolume(type) {
        if (type === 'fundo') {
            this.volumeFundo = this.volumeFundoRange.value / 100;
            this.volumeFundoValue.textContent = `${this.volumeFundoRange.value}%`;
            if (this.audioFundo) {
                this.audioFundo.volume = this.volumeFundo;
            }
        } else {
            this.volumeFinal = this.volumeFinalRange.value / 100;
            this.volumeFinalValue.textContent = `${this.volumeFinalRange.value}%`;
            if (this.audioFinal) {
                this.audioFinal.volume = this.volumeFinal;
            }
        }
    }
    
    iniciarSorteio() {
        if (this.nomes.length === 0) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now() - this.pausedTime;
        
        // Ativar modo colorido dos hexágonos
        if (typeof hexagonBackground !== 'undefined' && hexagonBackground) {
            if (!hexagonBackground.colorMode) {
                hexagonBackground.activateColorEffect(window.innerWidth / 2, window.innerHeight / 2);
            }
        }
        
        // Atualizar interface
        this.iniciarBtn.disabled = true;
        this.pausarBtn.disabled = false;
        this.displayElement.classList.add('matrix-mode');
        
        // Iniciar áudio de fundo
        if (this.audioFundo) {
            this.audioFundo.currentTime = 0;
            this.audioFundo.play().catch(console.error);
        }
        
        // Iniciar animação matrix
        this.startMatrixAnimation();
        
        // Configurar timer para finalizar
        this.sorteioTimeout = setTimeout(() => {
            this.finalizarSorteio();
        }, this.tempoSorteio * 1000 - this.pausedTime);
    }
    
    pausarSorteio() {
        if (!this.isRunning) return;
        
        if (this.isPaused) {
            // Retomar
            this.isPaused = false;
            this.startTime = Date.now() - this.pausedTime;
            
            this.pausarBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i><span>Pausar</span>';
            
            // Retomar áudio
            if (this.audioFundo) {
                this.audioFundo.play().catch(console.error);
            }
            
            // Retomar animação
            this.startMatrixAnimation();
            
            // Reconfigurar timeout
            const remainingTime = (this.tempoSorteio * 1000) - this.pausedTime;
            this.sorteioTimeout = setTimeout(() => {
                this.finalizarSorteio();
            }, remainingTime);
            
        } else {
            // Pausar
            this.isPaused = true;
            this.pausedTime = Date.now() - this.startTime;
            
            this.pausarBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i><span>Retomar</span>';
            
            // Pausar áudio
            if (this.audioFundo) {
                this.audioFundo.pause();
            }
            
            // Parar animação
            if (this.currentAnimation) {
                cancelAnimationFrame(this.currentAnimation);
            }
            
            // Cancelar timeout
            if (this.sorteioTimeout) {
                clearTimeout(this.sorteioTimeout);
            }
            
            // Mostrar mensagem de pausa
            this.messageElement.innerHTML = '<span class="glitch-text">SORTEIO PAUSADO</span>';
        }
    }
    
    startMatrixAnimation() {
        if (this.isPaused || !this.isRunning) return;
        
        const animate = () => {
            if (this.isPaused || !this.isRunning) return;
            
            // Gerar texto matrix usando apenas caracteres dos nomes
            let matrixText = '';
            const targetLength = Math.max(8, Math.min(15, this.nomes.join('').length));
            
            for (let i = 0; i < targetLength; i++) {
                if (this.matrixChars.length > 0) {
                    const randomChar = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
                    matrixText += randomChar;
                } else {
                    matrixText += String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
            
            this.messageElement.textContent = matrixText.toUpperCase();
            
            this.currentAnimation = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    finalizarSorteio() {
        this.isRunning = false;
        this.isPaused = false;
        this.pausedTime = 0;
        
        // Parar animação
        if (this.currentAnimation) {
            cancelAnimationFrame(this.currentAnimation);
        }
        
        // Parar áudio de fundo
        if (this.audioFundo) {
            this.audioFundo.pause();
            this.audioFundo.currentTime = 0;
        }
        
        // Desativar modo colorido dos hexágonos
        if (typeof hexagonBackground !== 'undefined' && hexagonBackground) {
            if (hexagonBackground.colorMode) {
                hexagonBackground.activateColorEffect(window.innerWidth / 2, window.innerHeight / 2);
            }
        }
        
        // Sortear vencedor
        const vencedor = this.nomes[Math.floor(Math.random() * this.nomes.length)];
        
        // Truncar nome se for muito longo (máximo 12 caracteres)
        const nomeExibido = vencedor.length > 12 ? vencedor.substring(0, 12) + '...' : vencedor;
        
        // Atualizar interface
        this.displayElement.classList.remove('matrix-mode');
        this.messageElement.innerHTML = `<span class="glitch-text">🎉 ${nomeExibido.toUpperCase()} 🎉</span>`;
        
        this.iniciarBtn.disabled = false;
        this.pausarBtn.disabled = true;
        this.pausarBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i><span>Pausar</span>';
        
        // Tocar áudio final
        if (this.audioFinal) {
            this.audioFinal.currentTime = 0;
            this.audioFinal.play().catch(console.error);
        }
        
        // Limpar timeout
        if (this.sorteioTimeout) {
            clearTimeout(this.sorteioTimeout);
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos na página extras
    if (document.getElementById('roletaDisplay')) {
        new RoletaCompacta();
    }
});