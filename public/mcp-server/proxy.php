<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Получаем токен из заголовка Authorization
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Missing or invalid Authorization header']);
    exit;
}

$token = $matches[1];

// Получаем данные из ListOk CRM
$domain = $_GET['domain'] ?? '';
if (!$domain) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing domain parameter']);
    exit;
}

// Определяем endpoint на основе пути
$path = $_SERVER['REQUEST_URI'];
$path = preg_replace('/^\/mcp-server\//', '', $path);
$path = preg_replace('/\?.*$/', '', $path);

$apiUrl = "https://$domain/api/external/v2/$path";

// Forward the request to ListOk API
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Content-Type: application/json",
    "Accept: application/json",
    "X-Requested-With: XMLHttpRequest"
]);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response;
