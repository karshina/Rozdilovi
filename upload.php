<?php

include_once 'utils.php';

$imageId = getRandomHex(10);
$fileName = __DIR__ . '/uploads/' . $imageId . '.jpg';

$dataBase64 = file_get_contents("php://input");
file_put_contents($fileName, base64_decode($dataBase64));

header('Content-Type: application/json');
echo json_encode(array(
  "id" => $imageId
));
