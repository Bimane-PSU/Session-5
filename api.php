<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Function to read .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $env[trim($name)] = trim($value);
    }
    
    return $env;
}

// Load environment variables
$env = loadEnv('.env');
if (!$env || !isset($env['GEMINI_API_KEY'])) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Configuration error',
        'message' => 'API Key tidak ditemukan. Pastikan file .env sudah dibuat dengan benar.'
    ]);
    exit();
}

$apiKey = $env['GEMINI_API_KEY'];

// Get request body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing message parameter']);
    exit();
}

$userMessage = $input['message'];

// System prompt for friendly personality
$systemPrompt = 'Kamu adalah ChatBot Teman, seorang AI assistant yang sangat ramah, ceria, dan asik diajak ngobrol seperti teman dekat. Karaktermu:

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

Ingat, kamu adalah teman yang selalu ada dan siap mendengarkan! 🌟';

// Prepare request to Gemini API
$geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" . $apiKey;

$requestBody = [
    'contents' => [
        [
            'parts' => [
                ['text' => $systemPrompt],
                ['text' => 'User: ' . $userMessage]
            ]
        ]
    ],
    'generationConfig' => [
        'temperature' => 0.9,
        'topK' => 1,
        'topP' => 1,
        'maxOutputTokens' => 2048
    ],
    'safetySettings' => [
        [
            'category' => 'HARM_CATEGORY_HARASSMENT',
            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
        ],
        [
            'category' => 'HARM_CATEGORY_HATE_SPEECH', 
            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
        ],
        [
            'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
        ],
        [
            'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
        ]
    ]
];

// Make request to Gemini API
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $geminiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($requestBody),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
    ],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => false
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Network error',
        'message' => 'Koneksi ke Gemini API bermasalah: ' . $curlError
    ]);
    exit();
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    $errorResponse = json_decode($response, true);
    echo json_encode([
        'error' => 'Gemini API error',
        'message' => isset($errorResponse['error']['message']) ? $errorResponse['error']['message'] : 'Unknown error'
    ]);
    exit();
}

$geminiResponse = json_decode($response, true);

if (isset($geminiResponse['candidates'][0]['content']['parts'][0]['text'])) {
    echo json_encode([
        'success' => true,
        'response' => $geminiResponse['candidates'][0]['content']['parts'][0]['text']
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Invalid response',
        'message' => 'Format response dari Gemini tidak sesuai'
    ]);
}
?>