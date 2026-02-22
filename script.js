const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const textInput = document.getElementById('text-input');
const charCount = document.querySelector('.char-count');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const fontSizeInput = document.getElementById('font-size');
const fontSizeValue = document.getElementById('font-size-value');
const textAlignInput = document.getElementById('text-align');
const cardRatioInput = document.getElementById('card-ratio');
const downloadBtn = document.getElementById('download-btn');
const presetBtns = document.querySelectorAll('.preset-btn');
const colorBtns = document.querySelectorAll('.color-btn');
const bgImageInput = document.getElementById('bg-image');
const clearBgImageBtn = document.getElementById('clear-bg-image');

let backgroundImage = null;

const presets = {
    minimal: {
        bgColor: '#ffffff',
        textColor: '#000000',
        fontSize: 64,
        textAlign: 'center'
    },
    gradient: {
        bgColor: '#ff6b6b',
        bgGradient: ['#ff6b6b', '#feca57'],
        textColor: '#ffffff',
        fontSize: 72,
        textAlign: 'center'
    },
    dark: {
        bgColor: '#1a1a1a',
        textColor: '#ffffff',
        fontSize: 64,
        textAlign: 'center'
    },
    noteYellow: {
        bgColor: '#FFF9E6',
        bgPattern: 'noteYellow',
        textColor: '#333333',
        fontSize: 64,
        textAlign: 'left'
    },
    noteCyan: {
        bgColor: '#E6F9F9',
        bgPattern: 'noteCyan',
        textColor: '#333333',
        fontSize: 64,
        textAlign: 'left'
    },
    notePink: {
        bgColor: '#FFE6F0',
        bgPattern: 'notePink',
        textColor: '#333333',
        fontSize: 64,
        textAlign: 'left'
    }
};

let currentPreset = 'minimal';

function updateCanvasSize() {
    const ratio = cardRatioInput.value;
    const baseWidth = 1080;
    
    switch(ratio) {
        case '4:5':
            canvas.width = 1080;
            canvas.height = 1350;
            break;
        case '9:16':
            canvas.width = 1080;
            canvas.height = 1920;
            break;
        case '16:9':
            canvas.width = 1920;
            canvas.height = 1080;
            break;
        case '1:1':
            canvas.width = baseWidth;
            canvas.height = baseWidth;
            break;
    }
    
    drawCard();
}

function drawNotePattern(bgColor, patternType) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 노트 줄 그리기
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 2;
    
    const lineSpacing = 60;
    const startY = 100;
    
    for (let y = startY; y < canvas.height - 50; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(80, y);
        ctx.lineTo(canvas.width - 80, y);
        ctx.stroke();
    }
    
    // 왼쪽 여백선 (빨간선)
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 50);
    ctx.lineTo(80, canvas.height - 50);
    ctx.stroke();
}

function drawCard() {
    const text = textInput.value || '해달에듀 재원생을 모을 창의적인 아이디어를 작성해요';
    const bgColor = bgColorInput.value;
    const textColor = textColorInput.value;
    const fontSize = parseInt(fontSizeInput.value);
    const textAlign = textAlignInput.value;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (backgroundImage) {
        const imgAspect = backgroundImage.width / backgroundImage.height;
        const canvasAspect = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspect > canvasAspect) {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgAspect;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }
        
        ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
    } else {
        const preset = presets[currentPreset];
        
        if (preset.bgPattern) {
            drawNotePattern(preset.bgColor, preset.bgPattern);
        } else if (preset.bgGradient) {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, preset.bgGradient[0]);
            gradient.addColorStop(1, preset.bgGradient[1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px "Noto Sans KR", Arial, sans-serif`;
    ctx.textBaseline = 'middle';
    
    let x;
    switch(textAlign) {
        case 'left':
            ctx.textAlign = 'left';
            x = 80;
            break;
        case 'right':
            ctx.textAlign = 'right';
            x = canvas.width - 80;
            break;
        default:
            ctx.textAlign = 'center';
            x = canvas.width / 2;
    }
    
    const y = canvas.height / 2;
    
    const maxWidth = canvas.width - 160;
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    
    const lineHeight = fontSize * 1.4;
    const totalHeight = lines.length * lineHeight;
    const startY = y - (totalHeight / 2) + (lineHeight / 2);
    
    lines.forEach((line, index) => {
        ctx.fillText(line, x, startY + (index * lineHeight));
    });
}

function applyPreset(presetName) {
    currentPreset = presetName;
    const preset = presets[presetName];
    
    if (!preset.bgGradient && !preset.bgPattern) {
        bgColorInput.value = preset.bgColor;
    }
    textColorInput.value = preset.textColor;
    fontSizeInput.value = preset.fontSize;
    fontSizeValue.textContent = preset.fontSize;
    textAlignInput.value = preset.textAlign;
    
    presetBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.preset === presetName) {
            btn.classList.add('active');
        }
    });
    
    drawCard();
}

function downloadCard() {
    const link = document.createElement('a');
    const text = textInput.value || '슬로건카드';
    const fileName = text.substring(0, 15).trim() || '슬로건카드';
    const timestamp = new Date().getTime();
    link.download = `${fileName}_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

textInput.addEventListener('input', () => {
    const length = textInput.value.length;
    charCount.textContent = `${length} / 50`;
    drawCard();
});

bgColorInput.addEventListener('input', drawCard);
textColorInput.addEventListener('input', drawCard);

fontSizeInput.addEventListener('input', () => {
    fontSizeValue.textContent = fontSizeInput.value;
    drawCard();
});

textAlignInput.addEventListener('change', drawCard);
cardRatioInput.addEventListener('change', updateCanvasSize);

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        applyPreset(btn.dataset.preset);
    });
});

downloadBtn.addEventListener('click', downloadCard);

colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const color = btn.dataset.color;
        const parentGroup = btn.closest('.control-group');
        const colorInput = parentGroup.querySelector('input[type="color"]');
        colorInput.value = color;
        drawCard();
    });
});

bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                backgroundImage = img;
                clearBgImageBtn.style.display = 'block';
                drawCard();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

clearBgImageBtn.addEventListener('click', () => {
    backgroundImage = null;
    bgImageInput.value = '';
    clearBgImageBtn.style.display = 'none';
    drawCard();
});

drawCard();
