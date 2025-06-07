<?php
// api/gemini.php
header('Content-Type: application/json');
$apiKey = 'AIzaSyBEq9i_h4hPXHJ_E_JLq2PmJXbCBqZfdWs'; // Mets ta clé ici
$endpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['prompt'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Prompt manquant']);
    exit;
}

$payload = [
    'contents' => [
        [ 'role' => 'user', 'parts' => [ [ 'text' => $input['prompt'] ] ] ]
    ]
];
$options = [
    'http' => [
        'header'  => "Content-Type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($payload),
        'timeout' => 30
    ]
];
$context  = stream_context_create($options);
$result = file_get_contents($endpoint, false, $context);

if ($result === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur Gemini']);
    exit;
}
echo $result;
?>