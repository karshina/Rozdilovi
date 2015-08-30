<?php

function getRandomHex($num_bytes=4) {
  return bin2hex(openssl_random_pseudo_bytes($num_bytes));
}

$imageId = getRandomHex(10);
$fileName = __DIR__ . '/public/uploads/' . $imageId . '.png';

$dataBase64 = file_get_contents("php://input");
file_put_contents($fileName, base64_decode($dataBase64));

header('Content-Type: application/json');
echo json_encode(array(
  "id" => $imageId
));
