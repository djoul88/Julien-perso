<?php
header('Content-Type: application/json');

// Mets ta vraie clé ici
$apiKey = 'TON_API_KEY_ICI'; // <-- À remplacer

$endpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['prompt']) || strlen($input['prompt']) < 10) {
    http_response_code(400);
    echo json_encode(['error' => 'Prompt manquant ou trop court']);
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
        'timeout' => 40
    ]
];
$context = stream_context_create($options);
$result = @file_get_contents($endpoint, false, $context);

if ($result === FALSE) {
    http_response_code(502);
    echo json_encode(['error' => 'Erreur lors de la requête Gemini']);
    exit;
}
echo $result;
?>