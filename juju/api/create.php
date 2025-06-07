<?php
header('Content-Type: application/json');

$pages_dir = __DIR__ . '/../pages/';
$base_url = 'https://queste.fr/juju/pages/';

if (!is_dir($pages_dir)) {
    mkdir($pages_dir, 0775, true);
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['html']) || !is_string($data['html']) || strlen($data['html']) < 20) {
    echo json_encode(['success' => false, 'error' => 'HTML manquant ou trop court.']);
    exit;
}

$id = bin2hex(random_bytes(6));
$file = $pages_dir . $id . '.html';
file_put_contents($file, $data['html']);

$url = $base_url . $id . '.html';
$qr_url = 'https://chart.googleapis.com/chart?cht=qr&chs=320x320&chl=' . urlencode($url);

echo json_encode([
    'success' => true,
    'url' => $url,
    'qr' => $qr_url
]);