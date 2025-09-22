// Global Variables
let isTyping = false;
let API_KEY = '';

// System prompt untuk personality yang ramah dan asik
const SYSTEM_PROMPT = `Kamu adalah ChatBot Teman, seorang AI assistant yang sangat ramah, ceria, dan asik diajak ngobrol seperti teman dekat. Karaktermu:

1. PERSONALITY:
- Sangat ramah dan hangat seperti sahabat lama
- Suka menggunakan emoji yang tepat dan tidak berlebihan 😊
- Bahasa yang santai tapi sopan, seperti anak muda Indonesia
- Suka bercanda ringan dan membuat suasana cair
- Selalu antusias dan positif dalam merespons
- Empati tinggi dan bisa merasakan mood lawan bicara

2. CARA BERBICARA:
- Gunakan bahasa Indonesia sehari-hari yang natural
- Sesekali pakai kata-kata gaul yang umum ("kok", "sih", "dong", "banget")
- Jangan terlalu formal, tapi tetap sopan
- Respon dengan panjang yang pas, tidak terlalu pendek atau panjang
- Suka bertanya balik untuk membuat percakapan mengalir

3. TOPIK YANG BISA DIBAHAS:
- Kehidupan sehari-hari, hobi, makanan, film, musik
- Curhat dan masalah pribadi (berikan dukungan dan saran)
- Jokes ringan dan humor
- Trivia menarik dan fun facts
- Motivasi dan semangat hidup
- Teknologi, game, dan hal-hal kekinian

4. BATASAN:
- Jangan bahas hal-hal yang terlalu serius seperti politik kontroversial
- Jika ditanya hal yang tidak tahu, akui dengan lucu
- Tetap positif dan hindari topik yang bisa bikin sedih berkepanjangan

Ingat, kamu adalah teman yang selalu ada dan siap mendengarkan! 🌟`;

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const settingsPanel = document.getElementById('settingsPanel');
const apiKeyInput = document.getElementById('apiKey');
const typingIndicator = document.getElementById('typingIndicator');
const status = document.getElementById('status');

// Server mode detection
let useServerMode = true;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateTimestamp();
    initializeEventListeners();
    checkApiConnection();
});

// Event Listeners
function initializeEventListeners() {
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize input
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
}

// API Connection Functions
async function checkApiConnection() {
    try {
        // Try server mode first
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'test connection'
            })
        });
        
        if (response.ok) {
            useServerMode = true;
            updateStatus('Online (Server Mode)');
        } else {
            throw new Error('Server mode failed');
        }
    } catch (error) {
        // Fallback to client mode
        useServerMode = false;
        updateStatus('Perlu Setup Manual');
        showFallbackSettings();
    }
}

function showFallbackSettings() {
    // Show manual API key input as fallback
    const settingsContent = document.querySelector('.settings-content');
    settingsContent.innerHTML = `
        <h3>⚠️ Fallback Mode</h3>
        <div class="warning-card">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Server PHP tidak tersedia. Menggunakan mode fallback.</p>
        </div>
        
        <div class="input-group">
            <label for="fallbackApiKey">Gemini API Key:</label>
            <input type="password" id="fallbackApiKey" placeholder="Masukkan API Key Gemini Anda...">
            <button onclick="toggleFallbackApiVisibility()" class="toggle-visibility">
                <i class="fas fa-eye" id="fallbackEyeIcon"></i>
            </button>
        </div>
        
        <button onclick="saveFallbackApiKey()" class="save-btn">Simpan API Key</button>
        
        <div class="fallback-info">
            <h4>📝 Untuk mode server (recommended):</h4>
            <ol>
                <li>Install XAMPP/WAMP/LAMP</li>
                <li>Letakkan folder ini di htdocs/www</li>
                <li>Start Apache server</li>
                <li>Akses via http://localhost/</li>
            </ol>
        </div>
        
        <div class="api-help">
            <p><i class="fas fa-info-circle"></i> Dapatkan API Key gratis di <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></p>
        </div>
    `;
    
    // Load existing API key if any
    const existingKey = localStorage.getItem('gemini_api_key');
    if (existingKey) {
        document.getElementById('fallbackApiKey').value = existingKey;
        API_KEY = existingKey;
        updateStatus('Online (Fallback Mode)');
    }
}

// Settings Functions
function toggleSettings() {
    settingsPanel.classList.toggle('active');
}

function toggleApiVisibility() {
    // Function tidak diperlukan lagi karena menggunakan .env
    showNotification('API Key sekarang disimpan di file .env untuk keamanan', 'info');
}

function toggleFallbackApiVisibility() {
    const fallbackApiKey = document.getElementById('fallbackApiKey');
    const eyeIcon = document.getElementById('fallbackEyeIcon');
    
    if (fallbackApiKey.type === 'password') {
        fallbackApiKey.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        fallbackApiKey.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

function saveApiKey() {
    // Function tidak diperlukan lagi karena menggunakan .env
    showNotification('API Key sekarang disimpan di file .env untuk keamanan', 'info');
}

function saveFallbackApiKey() {
    const fallbackApiKey = document.getElementById('fallbackApiKey');
    const key = fallbackApiKey.value.trim();
    
    if (key) {
        API_KEY = key;
        localStorage.setItem('gemini_api_key', key);
        showNotification('API Key berhasil disimpan! 🎉', 'success');
        settingsPanel.classList.remove('active');
        updateStatus('Online (Fallback Mode)');
    } else {
        showNotification('Mohon masukkan API Key yang valid', 'error');
    }
}

function loadApiKey() {
    // Function tidak diperlukan lagi karena menggunakan .env
    return true;
}

// Message Functions
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;
    
    if (!useServerMode && !API_KEY) {
        showNotification('Mohon masukkan API Key terlebih dahulu di pengaturan', 'error');
        toggleSettings();
        return;
    }
    
    // Add user message
    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Disable send button and show typing
    sendBtn.disabled = true;
    showTypingIndicator();
    
    try {
        let response;
        if (useServerMode) {
            response = await callLocalAPI(message);
        } else {
            response = await callGeminiAPI(message);
        }
        hideTypingIndicator();
        addMessage(response, 'bot');
    } catch (error) {
        hideTypingIndicator();
        console.error('Error:', error);
        
        let errorMessage = 'Waduh, ada masalah nih! 😅 ';
        if (error.message.includes('API Key tidak ditemukan')) {
            errorMessage += 'File .env belum dibuat atau API Key belum diisi. Cek dokumentasi ya!';
        } else if (error.message.includes('web server')) {
            errorMessage += 'Aplikasi perlu dijalankan melalui web server seperti XAMPP/WAMP/LAMP.';
        } else if (error.message.includes('quota')) {
            errorMessage += 'Quota API Gemini sudah habis. Coba lagi nanti ya!';
        } else if (error.message.includes('API_KEY_INVALID')) {
            errorMessage += 'API Key-nya sepertinya nggak valid deh. Coba cek lagi ya!';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage += 'Koneksi internet bermasalah. Cek koneksi kamu ya!';
        } else {
            errorMessage += 'Coba kirim pesan lagi dalam beberapa saat ya!';
        }
        
        addMessage(errorMessage, 'bot');
    }
    
    sendBtn.disabled = false;
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<p>${formatMessage(text)}</p>`;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.innerHTML = `<span class="time-stamp">${getCurrentTime()}</span>`;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(text) {
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Make URLs clickable
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    return text;
}

// API Functions
async function callLocalAPI(message) {
    const response = await fetch('api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network error');
    }
    
    const data = await response.json();
    
    if (data.success && data.response) {
        return data.response;
    } else {
        throw new Error(data.message || 'Unexpected response format');
    }
}

async function callGeminiAPI(message) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
    
    const requestBody = {
        contents: [
            {
                parts: [
                    { text: SYSTEM_PROMPT },
                    { text: `User: ${message}` }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Network error');
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Unexpected response format');
    }
}

// UI Helper Functions
function showTypingIndicator() {
    isTyping = true;
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    updateStatus('Sedang mengetik...');
}

function hideTypingIndicator() {
    isTyping = false;
    typingIndicator.style.display = 'none';
    const statusText = useServerMode ? 'Online (Server Mode)' : 'Online (Fallback Mode)';
    updateStatus(statusText);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `${type}-message`;
    notification.textContent = message;
    
    // Insert after settings content
    const settingsContent = document.querySelector('.settings-content');
    settingsContent.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateStatus(statusText) {
    status.textContent = statusText;
    
    // Update status color
    if (statusText.includes('Online')) {
        status.style.color = '#4CAF50';
    } else if (statusText === 'Sedang mengetik...') {
        status.style.color = '#FF9800';
    } else if (statusText.includes('Perlu Setup')) {
        status.style.color = '#FF5722';
    } else {
        status.style.color = '#F44336';
    }
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function updateTimestamp() {
    const timestamp = document.querySelector('.time-stamp');
    if (timestamp) {
        timestamp.textContent = getCurrentTime();
    }
}

// Keyboard shortcut for settings
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        toggleSettings();
    }
});

// Handle key press in message input
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Initialize fun welcome messages
const welcomeMessages = [
    "Halo! Aku ChatBot Teman mu yang siap diajak ngobrol kapan aja! 😊",
    "Hi there! Aku di sini buat jadi teman ngobrol kamu nih! 🤗",
    "Yeay! Ada teman baru! Mau ngobrol apa hari ini? 🌟",
    "Hallo! Aku siap dengerin cerita kamu dan ngobrol seru bareng! 💫"
];

// Add random welcome message on load
document.addEventListener('DOMContentLoaded', function() {
    const existingWelcome = document.querySelector('.bot-message .message-content p');
    if (existingWelcome) {
        const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        existingWelcome.innerHTML = randomWelcome + '<br><br>Aku akan coba detect setup otomatis, atau kamu bisa manual setup di pengaturan! ⚙️';
    }
});