# Documentação Completa do Site Alan Joga+

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Funcionalidades](#funcionalidades)
- [Instruções de Atualização](#instruções-de-atualização)
  - [Atualização de Métricas do Canal](#atualização-de-métricas-do-canal)
  - [Atualização de Produtos na Loja](#atualização-de-produtos-na-loja)
  - [Atualização de Vídeos na Página do Canal](#atualização-de-vídeos-na-página-do-canal)
  - [Atualização de Informações de Contato](#atualização-de-informações-de-contato)
  - [Atualização de Links de Redes Sociais](#atualização-de-links-de-redes-sociais)
  - [Atualização de Meta Tags e SEO](#atualização-de-meta-tags-e-seo)
  - [Atualização de Animações e Comportamentos Dinâmicos](#atualização-de-animações-e-comportamentos-dinâmicos)
- [Manutenção](#manutenção)
- [Otimização de Performance](#otimização-de-performance)
- [Acessibilidade](#acessibilidade)
- [SEO e Meta Tags](#seo-e-meta-tags)
- [Licença](#licença)
- [Contato](#contato)

## Sobre o Projeto

O website Alan Joga+ é um portal dedicado ao canal de jogos retrô do YouTube. O site apresenta um design cyberpunk com elementos visuais dinâmicos e interativos, oferecendo aos visitantes informações sobre o canal, vídeos recentes, produtos da loja e formas de contato.

### Características Principais

- Design cyberpunk com animações e efeitos visuais
- Integração com YouTube para exibição de vídeos recentes
- Loja virtual com produtos exclusivos
- Layout responsivo para todos os dispositivos
- Efeitos visuais otimizados com detecção de performance

## Tecnologias Utilizadas

### HTML5
- Estrutura semântica para melhor acessibilidade e SEO
- Schema.org para marcação estruturada
- Open Graph e Twitter Cards para compartilhamento em redes sociais

### CSS3
- Variáveis CSS para gerenciamento de cores e estilos
- Flexbox e Grid para layouts responsivos
- Animações e transições para elementos interativos
- Media queries para adaptação a diferentes dispositivos

### JavaScript
- Manipulação do DOM para interatividade
- Canvas API para o fundo de hexágonos animados
- Lazy loading para carregamento otimizado de imagens
- Debouncing para otimização de eventos
- Detecção de performance para ajuste automático de efeitos visuais

### Bibliotecas e Frameworks
- Font Awesome para ícones
- Google Fonts (Orbitron e Rajdhani)
- Lite YouTube Embed para carregamento otimizado de vídeos
- RSS2JSON API para integração com feed do YouTube

### Ferramentas de Desenvolvimento
- Servidor HTTP Python para testes locais
- Git para controle de versão
- WebP para otimização de imagens

## Estrutura do Projeto

```
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── alan_profile.webp
│   │   ├── favicon.ico
│   │   ├── main_logo.webp
│   │   └── products/
│   └── scripts/
│       ├── hexagon-background.js
│       └── main.js
├── index.html
├── canal.html
├── shop.html
├── sobre.html
├── contato.html
├── LICENSE
├── README.md
└── INSTRUCOES_ATUALIZACAO.md
```

### Arquivos HTML
- `index.html`: Página inicial com destaque para o canal
- `canal.html`: Exibição de vídeos recentes e transmissões ao vivo
- `shop.html`: Loja virtual com produtos exclusivos
- `sobre.html`: Informações sobre o canal e sua história
- `contato.html`: Formulário de contato e redes sociais

### CSS
- `style.css`: Estilos globais, variáveis CSS, layouts e animações

### JavaScript
- `main.js`: Funcionalidades principais como navegação, animações e integração com YouTube
- `hexagon-background.js`: Animação de fundo com hexágonos usando Canvas API

### Imagens
- Imagens otimizadas em formato WebP
- Ícones e logos do canal

## Instalação e Configuração

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local para desenvolvimento (opcional)

### Instalação Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/alanjogamais-website.git
   cd alanjogamais-website
   ```

2. Inicie um servidor local:
   ```bash
   # Usando Python (recomendado)
   python -m http.server 8000
   ```

3. Acesse o site em seu navegador:
   ```
   http://localhost:8000
   ```

### Configuração para Produção

1. Faça upload dos arquivos para seu servidor web
2. Configure seu domínio para apontar para o diretório do site

## Funcionalidades

### Interface e Design

#### Tema Cyberpunk
- Paleta de cores neon com destaque para azul ciano
- Tipografia futurista com fontes Orbitron e Rajdhani
- Efeitos de glitch e distorção

#### Animações
- Fundo animado com hexágonos interativos
- Efeitos de hover em elementos interativos
- Animações de entrada para elementos da página

#### Elementos Visuais
- Efeito de vidro (glass morphism) em cards e painéis
- Bordas brilhantes com efeito neon
- Ícones temáticos e ilustrações personalizadas

### Responsividade
- Layout adaptativo para desktop, tablet e mobile
- Menu de navegação colapsável em dispositivos móveis
- Imagens e elementos redimensionáveis

### Integração com YouTube
- Exibição de vídeos recentes do canal
- Player de vídeo otimizado com Lite YouTube Embed
- Verificação de status de transmissão ao vivo

### Métricas do Canal
- Contadores animados para inscritos, vídeos e visualizações
- Cálculo automático do tempo de existência do canal
- Atualização periódica das estatísticas

## Instruções de Atualização

Esta seção contém instruções detalhadas sobre como atualizar conteúdos específicos nos cards e seções existentes no site Alan Joga+.

### Atualização de Métricas do Canal

As métricas do canal (número de inscritos, vídeos, etc.) são exibidas na página inicial e precisam ser atualizadas periodicamente.

#### Localização no Código

Arquivo: `index.html`

Procure a seção com o ID `metrics` (aproximadamente linhas 40-70):

```html
<!-- Metrics Section -->
<section id="metrics" class="metrics-section" aria-labelledby="metrics-title">
    <div class="container">
        <h2 id="metrics-title" class="section-title">Estatísticas do Canal</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-icon">
                    <i class="fas fa-users" aria-hidden="true"></i>
                </div>
                <div class="metric-number" data-target="4200">0</div>
                <div class="metric-label">Inscritos</div>
            </div>
            
            <!-- Outras métricas aqui -->
        </div>
    </div>
</section>
```

#### Como Atualizar

1. Identifique o card da métrica que deseja atualizar (Inscritos, Vídeos, etc.)
2. Altere o valor do atributo `data-target` para o novo número
3. Exemplo: Para atualizar o número de inscritos para 5000, altere `data-target="4200"` para `data-target="5000"`

#### Adicionando Nova Métrica

Para adicionar uma nova métrica:

1. Copie o bloco de código de uma métrica existente:

```html
<div class="metric-card">
    <div class="metric-icon">
        <i class="fas fa-users" aria-hidden="true"></i>
    </div>
    <div class="metric-number" data-target="4200">0</div>
    <div class="metric-label">Inscritos</div>
</div>
```

2. Cole o bloco dentro da div `metrics-grid`
3. Altere o ícone, substituindo a classe do FontAwesome (ex: `fa-users` para outro ícone)
4. Altere o valor de `data-target` para o número desejado
5. Altere o texto dentro da div `metric-label` para o nome da nova métrica

#### Removendo uma Métrica

Para remover uma métrica, simplesmente delete todo o bloco `<div class="metric-card">...</div>` correspondente à métrica que deseja remover.

### Atualização de Produtos na Loja

Os produtos são exibidos na página da loja (`shop.html`) e podem ser atualizados, adicionados ou removidos conforme necessário.

#### Localização no Código

Arquivo: `shop.html`

Procure a seção com a classe `products-grid` (aproximadamente linhas 120-200):

```html
<div class="products-grid">
    <!-- Product 1 -->
    <div class="product-card">
        <div class="product-image">
            <img src="./assets/images/products/caneca_01.webp" alt="Caneca Gamer Retrô Alan Joga+" loading="lazy">
            <div class="product-overlay">
                <span class="product-badge">Exclusivo</span>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title">Caneca Gamer Retrô</h3>
            <p class="product-description">Caneca exclusiva do canal Alan Joga+...</p>
            <div class="product-features">
                <span class="feature"><i class="fas fa-check"></i> Cerâmica Premium</span>
                <span class="feature"><i class="fas fa-check"></i> Design Exclusivo</span>
                <span class="feature"><i class="fas fa-check"></i> 325ml</span>
            </div>
            <div class="product-price">
                <span class="price-current">R$ 39,90</span>
                <span class="price-original">R$ 49,90</span>
            </div>
            <a href="https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=PLACEHOLDER_CANECA_RETRO" class="product-button cta-button cta-primary" target="_blank" rel="noopener noreferrer" aria-label="Comprar Caneca Gamer Retrô">
                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                <span>Comprar Agora</span>
            </a>
        </div>
    </div>
    
    <!-- Outros produtos aqui -->
</div>
```

#### Como Atualizar um Produto Existente

1. Localize o bloco `<div class="product-card">...</div>` do produto que deseja atualizar
2. Para atualizar a imagem: altere o atributo `src` da tag `<img>` para o caminho da nova imagem
3. Para atualizar o título: altere o texto dentro da tag `<h3 class="product-title">...</h3>`
4. Para atualizar a descrição: altere o texto dentro da tag `<p class="product-description">...</p>`
5. Para atualizar as características: modifique os elementos `<span class="feature">...</span>` dentro da div `product-features`
6. Para atualizar os preços: altere os valores dentro das tags `<span class="price-current">...</span>` e `<span class="price-original">...</span>`
7. Para atualizar o link de compra: altere o atributo `href` da tag `<a>` para o novo link de checkout

#### Adicionando um Novo Produto

1. Adicione a imagem do produto na pasta `./assets/images/products/`
2. Copie o bloco completo de um produto existente (de `<div class="product-card">` até `</div>` correspondente)
3. Cole o bloco dentro da div `products-grid`
4. Atualize todos os elementos conforme descrito na seção "Como Atualizar um Produto Existente"

#### Removendo um Produto

Para remover um produto, simplesmente delete todo o bloco `<div class="product-card">...</div>` correspondente ao produto que deseja remover.

### Atualização de Vídeos na Página do Canal

A página do canal (`canal.html`) exibe vídeos do YouTube que podem ser atualizados periodicamente.

#### Localização no Código

Arquivo: `canal.html`

Procure a seção com a classe `videos-grid` (aproximadamente linhas 150-250):

```html
<div class="videos-grid">
    <!-- Video 1 -->
    <div class="video-card">
        <div class="video-container">
            <lite-youtube videoid="VIDEO_ID_AQUI" playlabel="Play: Título do Vídeo"></lite-youtube>
        </div>
        <div class="video-info">
            <h3 class="video-title">Título do Vídeo</h3>
            <p class="video-description">Descrição do vídeo aqui...</p>
        </div>
    </div>
    
    <!-- Outros vídeos aqui -->
</div>
```

#### Como Atualizar um Vídeo Existente

1. Localize o bloco `<div class="video-card">...</div>` do vídeo que deseja atualizar
2. Para atualizar o vídeo: altere o atributo `videoid` da tag `<lite-youtube>` para o ID do novo vídeo do YouTube
   - O ID do vídeo é a parte final da URL do YouTube (ex: em `https://www.youtube.com/watch?v=ABC123`, o ID é `ABC123`)
3. Atualize também o atributo `playlabel` para refletir o título do novo vídeo
4. Para atualizar o título: altere o texto dentro da tag `<h3 class="video-title">...</h3>`
5. Para atualizar a descrição: altere o texto dentro da tag `<p class="video-description">...</p>`

#### Adicionando um Novo Vídeo

1. Copie o bloco completo de um vídeo existente (de `<div class="video-card">` até `</div>` correspondente)
2. Cole o bloco dentro da div `videos-grid`
3. Atualize o ID do vídeo, título e descrição conforme descrito na seção "Como Atualizar um Vídeo Existente"

#### Removendo um Vídeo

Para remover um vídeo, simplesmente delete todo o bloco `<div class="video-card">...</div>` correspondente ao vídeo que deseja remover.

### Atualização de Informações de Contato

As informações de contato são exibidas na página de contato (`contato.html`) e podem precisar de atualizações ocasionais.

#### Localização no Código

Arquivo: `contato.html`

Procure a seção com a classe `contact-info` (aproximadamente linhas 100-150):

```html
<div class="contact-info">
    <div class="contact-item">
        <div class="contact-icon">
            <i class="fas fa-envelope" aria-hidden="true"></i>
        </div>
        <div class="contact-text">
            <h3>Email</h3>
            <p><a href="mailto:contato@alanjogamais.com">contato@alanjogamais.com</a></p>
        </div>
    </div>
    
    <!-- Outras informações de contato aqui -->
</div>
```

#### Como Atualizar Informações de Contato

1. Localize o bloco `<div class="contact-item">...</div>` da informação que deseja atualizar
2. Para atualizar o email: altere o texto e o atributo `href` da tag `<a>` dentro da tag `<p>`
3. Para atualizar outras informações: siga o mesmo padrão, alterando o texto dentro das tags correspondentes

#### Adicionando Nova Informação de Contato

1. Copie o bloco completo de uma informação existente (de `<div class="contact-item">` até `</div>` correspondente)
2. Cole o bloco dentro da div `contact-info`
3. Altere o ícone, substituindo a classe do FontAwesome (ex: `fa-envelope` para outro ícone)
4. Atualize o título e as informações conforme necessário

#### Removendo uma Informação de Contato

Para remover uma informação de contato, simplesmente delete todo o bloco `<div class="contact-item">...</div>` correspondente à informação que deseja remover.

### Atualização de Links de Redes Sociais

Os links para redes sociais aparecem em várias páginas do site e podem precisar ser atualizados.

#### Localização no Código

Os links de redes sociais geralmente estão no rodapé de cada página. Procure a seção com a classe `social-links` (aproximadamente nas últimas linhas de cada arquivo HTML):

```html
<div class="social-links">
    <a href="https://www.youtube.com/@alanjogamais" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <i class="fab fa-youtube" aria-hidden="true"></i>
    </a>
    <a href="https://instagram.com/alanjogamais" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <i class="fab fa-instagram" aria-hidden="true"></i>
    </a>
    <!-- Outros links de redes sociais aqui -->
</div>
```

#### Como Atualizar Links de Redes Sociais

1. Localize a tag `<a>` correspondente à rede social que deseja atualizar
2. Altere o atributo `href` para o novo link da rede social
3. Se necessário, atualize também o atributo `aria-label` para refletir o nome da rede social

#### Adicionando Novo Link de Rede Social

1. Copie o bloco completo de um link existente (tag `<a>` completa)
2. Cole o bloco dentro da div `social-links`
3. Altere o ícone, substituindo a classe do FontAwesome (ex: `fa-youtube` para o ícone da nova rede social)
4. Atualize o atributo `href` para o link da nova rede social
5. Atualize o atributo `aria-label` para o nome da nova rede social

#### Removendo um Link de Rede Social

Para remover um link de rede social, simplesmente delete toda a tag `<a>` correspondente ao link que deseja remover.

### Atualização de Meta Tags e SEO

As meta tags e dados estruturados são importantes para o SEO do site e podem precisar ser atualizados quando houver mudanças no conteúdo ou foco do canal.

#### Atualização das Meta Tags Básicas

##### Localização no Código

Arquivo: Todos os arquivos HTML (index.html, canal.html, shop.html, etc.)

Procure a seção de meta tags no início de cada arquivo (aproximadamente linhas 1-20):

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Alan Joga+ - Canal de jogos retrô com lives, gameplays e nostalgia dos videogames clássicos. Nintendo, Sega, PlayStation e muito mais!">
<meta name="keywords" content="jogos retrô, videogames antigos, Nintendo, Sega, PlayStation, live gaming, nostalgia, Alan Joga Mais">
<meta name="author" content="Alan Joga+ | Desenvolvido por André "Tutankhamal" Borba">
<meta name="robots" content="index, follow">
```

##### Como Atualizar

1. Para atualizar a descrição do site: modifique o conteúdo do atributo `content` na tag `<meta name="description">`
2. Para atualizar as palavras-chave: modifique o conteúdo do atributo `content` na tag `<meta name="keywords">`
3. Para atualizar informações do autor: modifique o conteúdo do atributo `content` na tag `<meta name="author">`

#### Atualização das Meta Tags para Redes Sociais

##### Localização no Código

Arquivo: Todos os arquivos HTML

Procure as seções Open Graph e Twitter (aproximadamente linhas 10-25):

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://alanjogamais.com/">
<meta property="og:title" content="Alan Joga+ - Canal de Jogos Retrô">
<meta property="og:description" content="Canal de jogos retrô com lives, gameplays e nostalgia dos videogames clássicos. Nintendo, Sega, PlayStation e muito mais!">
<meta property="og:image" content="./assets/images/main_logo.webp">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://alanjogamais.com/">
<meta property="twitter:title" content="Alan Joga+ - Canal de Jogos Retrô">
<meta property="twitter:description" content="Canal de jogos retrô com lives, gameplays e nostalgia dos videogames clássicos.">
<meta property="twitter:image" content="./assets/images/main_logo.webp">
```

##### Como Atualizar

1. Para atualizar a URL do site: modifique o conteúdo do atributo `content` nas tags `<meta property="og:url">` e `<meta property="twitter:url">`
2. Para atualizar o título: modifique o conteúdo do atributo `content` nas tags `<meta property="og:title">` e `<meta property="twitter:title">`
3. Para atualizar a descrição: modifique o conteúdo do atributo `content` nas tags `<meta property="og:description">` e `<meta property="twitter:description">`
4. Para atualizar a imagem de compartilhamento: modifique o caminho no atributo `content` nas tags `<meta property="og:image">` e `<meta property="twitter:image">`

#### Atualização dos Dados Estruturados (Schema.org)

##### Localização no Código

Arquivo: Todos os arquivos HTML

Procure a seção de dados estruturados no final da tag `<head>` (aproximadamente linhas 40-60):

```html
<!-- Structured Data -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Alan Joga+",
    "url": "https://alanjogamais.com",
    "sameAs": [
        "https://www.youtube.com/@alanjogamais",
        "https://instagram.com/alanjogamais",
        "https://livepix.gg/alanjogamais"
    ],
    "jobTitle": "Content Creator",
    "description": "Criador de conteúdo especializado em jogos retrô e videogames clássicos"
}
</script>
```

##### Como Atualizar

1. Para atualizar o nome: modifique o valor da propriedade `"name"`
2. Para atualizar a URL do site: modifique o valor da propriedade `"url"`
3. Para atualizar os links de redes sociais: modifique os valores no array `"sameAs"`
4. Para atualizar o título profissional: modifique o valor da propriedade `"jobTitle"`
5. Para atualizar a descrição: modifique o valor da propriedade `"description"`

##### Adicionando Novas Redes Sociais aos Dados Estruturados

1. Localize o array `"sameAs"` nos dados estruturados
2. Adicione uma nova linha com a URL da rede social entre aspas duplas
3. Certifique-se de adicionar uma vírgula após cada URL, exceto a última

Exemplo:
```json
"sameAs": [
    "https://www.youtube.com/@alanjogamais",
    "https://instagram.com/alanjogamais",
    "https://livepix.gg/alanjogamais",
    "https://twitter.com/alanjogamais"  // Nova rede social adicionada
],
```

### Atualização de Animações e Comportamentos Dinâmicos

O site utiliza JavaScript para criar animações e comportamentos dinâmicos. Estas configurações podem ser ajustadas no arquivo `assets/scripts/main.js`.

#### Atualização das Animações de Métricas

##### Localização no Código

Arquivo: `assets/scripts/main.js`

Procure a função `initializeMetricsAnimation()` (aproximadamente linhas 130-170):

```javascript
function initializeMetricsAnimation() {
    // Selecionar apenas elementos com data-target (excluindo o elemento de idade do canal)
    const metricNumbers = document.querySelectorAll('.metric-number[data-target]');
    
    function animateMetrics() {
        if (metricsAnimated) return;
        
        // Resto do código da animação...
    }
    
    // Código para iniciar a animação quando visível...
}
```

##### Como Modificar a Velocidade da Animação

Dentro da função `animateMetrics()`, você pode ajustar a velocidade da animação alterando o valor da variável `speed`:

```javascript
const speed = 200; // Valor padrão: 200 (quanto maior, mais lenta a animação)
```

#### Atualização dos Efeitos Glitch

##### Localização no Código

Arquivo: `assets/scripts/main.js`

Procure a função `initializeGlitchEffects()` (aproximadamente linhas 100-130):

```javascript
function initializeGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        // Set data-text attribute for pseudo-elements
        element.setAttribute('data-text', element.textContent);
        
        // Add random glitch intervals
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                triggerGlitch(element);
            }
        }, 3000);
    });
    
    // Resto do código...
}
```

##### Como Modificar a Frequência do Efeito Glitch

1. Para alterar a frequência com que o efeito glitch ocorre, modifique o valor `0.1` (10% de chance):
   ```javascript
   if (Math.random() < 0.2) { // Aumentado para 20% de chance
   ```

2. Para alterar o intervalo entre as verificações, modifique o valor `3000` (3 segundos):
   ```javascript
   }, 2000); // Reduzido para 2 segundos
   ```

#### Atualização do Fundo de Hexágonos

O fundo animado de hexágonos é controlado pelo arquivo `assets/scripts/hexagon-background.js`.

##### Como Modificar a Densidade e Aparência dos Hexágonos

1. Abra o arquivo `assets/scripts/hexagon-background.js`
2. Procure a seção de configuração da classe `HexagonBackground` (aproximadamente linhas 20-40)
3. Modifique os seguintes parâmetros conforme necessário:
   - `this.hexSize` - Tamanho dos hexágonos
   - `this.hexSpacing` - Espaçamento entre hexágonos
   - `this.glowRadius` - Raio do brilho ao redor dos hexágonos
   - `this.glowIntensity` - Intensidade do brilho
   - `this.waveSpeed` - Velocidade da animação de onda
   - `this.blinkChance` - Chance de um hexágono piscar

## Manutenção

### Atualizações Regulares

- Verificar e atualizar as métricas do canal mensalmente
- Atualizar a lista de vídeos recentes semanalmente
- Verificar links quebrados mensalmente
- Atualizar produtos da loja conforme disponibilidade

### Backup

- Realizar backup completo do site antes de qualquer alteração significativa
- Manter pelo menos três versões de backup em locais diferentes
- Documentar todas as alterações realizadas

### Monitoramento

- Verificar o desempenho do site regularmente usando ferramentas como Google PageSpeed Insights
- Monitorar o tráfego e comportamento dos usuários com Google Analytics
- Verificar a indexação do site no Google Search Console

## Otimização de Performance

### Técnicas Implementadas

- Imagens otimizadas em formato WebP
- Carregamento lazy para imagens e vídeos
- Minificação de CSS e JavaScript
- Preconexão para recursos externos
- Detecção automática de capacidade de performance do dispositivo

### Adaptação de Performance

O site inclui um sistema de detecção de performance que ajusta automaticamente os efeitos visuais com base na capacidade do dispositivo:

- Em dispositivos de alto desempenho: animações completas e densidade máxima de hexágonos
- Em dispositivos de médio desempenho: redução na densidade de hexágonos e simplificação de algumas animações
- Em dispositivos de baixo desempenho: desativação de efeitos complexos e redução significativa na densidade de hexágonos

## Acessibilidade

### Recursos Implementados

- Estrutura semântica HTML5
- Alto contraste entre texto e fundo
- Navegação por teclado com indicadores de foco visíveis
- Labels descritivos para todos os elementos de formulário
- Estrutura de cabeçalhos hierárquica e consistente
- Atributos ARIA para elementos interativos
- Skip link para pular para o conteúdo principal

### Compatibilidade com Leitores de Tela

- Textos alternativos para todas as imagens
- Descrições para ícones e elementos visuais
- Landmarks ARIA para facilitar a navegação
- Mensagens de status para atualizações dinâmicas

## SEO e Meta Tags

### Meta Tags Essenciais

- Meta charset e viewport
- Meta description e keywords
- Meta author e robots

### Open Graph e Twitter Cards

- OG Type, URL, Title, Description e Image
- Twitter Card, URL, Title, Description e Image

### Dados Estruturados

- Schema.org em formato JSON-LD
- Marcação para Person (canal)
- Marcação para Product (produtos da loja)
- Marcação para VideoObject (vídeos do canal)

## Licença

Este projeto está licenciado sob termos específicos. Veja o arquivo `LICENSE` para detalhes completos.

### Restrições

- **Uso Comercial**: Proibido sem autorização expressa dos proprietários
- **Cópia/Reprodução**: Proibida sem autorização expressa dos proprietários

### Permissões

- **Estudo**: Permitido para fins educacionais e de aprendizado
- **Uso Privado**: Permitido para uso pessoal não comercial

### Limitações

- **Responsabilidade**: Os proprietários não são responsáveis por quaisquer danos resultantes do uso deste software
- **Garantia**: O software é fornecido "como está", sem garantias de qualquer tipo

**Importante**: Qualquer uso do conteúdo deste projeto deve mencionar o criador original e incluir as licenças de todos os recursos utilizados.

## Contato

### Proprietário do Canal

- **Nome**: Alan Joga+
- **Email**: contato@alanjogamais.com
- **YouTube**: [@alanjogamais](https://www.youtube.com/@alanjogamais)
- **Instagram**: [@alanjogamais](https://instagram.com/alanjogamais)

### Desenvolvedor do Site

- **Nome**: André "Tutankhamal" Borba
- **Email**: andre@tutankhamal.com
- **GitHub**: [@tutankhamal](https://github.com/tutankhamal)

### Links Úteis

- **Website**: [alanjogamais.com](https://alanjogamais.com)
- **Repositório**: [github.com/tutankhamal/alanjogamais-website](https://github.com/tutankhamal/alanjogamais-website)
- **Issues**: [github.com/tutankhamal/alanjogamais-website/issues](https://github.com/tutankhamal/alanjogamais-website/issues)
- **Discussões**: [github.com/tutankhamal/alanjogamais-website/discussions](https://github.com/tutankhamal/alanjogamais-website/discussions)

---

## Dicas Importantes

1. **Sempre faça backup** dos arquivos antes de realizar qualquer alteração
2. Teste as alterações em um ambiente local antes de publicar no servidor
3. Mantenha a consistência visual e de estilo em todas as páginas
4. Verifique se as imagens estão otimizadas para web antes de adicioná-las ao site
5. Mantenha os textos alternativos (atributo `alt`) das imagens para garantir a acessibilidade
6. Ao modificar o JavaScript, teste em diferentes navegadores para garantir compatibilidade
7. Evite alterar a estrutura básica das funções para não quebrar funcionalidades existentes

Para dúvidas ou suporte adicional, entre em contato com o desenvolvedor do site através das informações disponíveis na página de contato.