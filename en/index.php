<?php

include_once '../utils.php';

//if (strpos($_SERVER['HTTP_HOST'], 'rozdilovi.org') === false ) {
$index = file_get_contents(__DIR__ . '/index.html');
//} else {
//	$index = file_get_contents(__DIR__ . '/indexstub.html');
//}

$index = str_replace('{{URL}}', htmlspecialchars(full_url($_SERVER, true)), $index);

if (isset($_GET['img'])) {
  $uploadFilename = 'uploads/' . preg_replace('/[^a-z\d]/i', '', $_GET['img']) . '.jpg';
  if (file_exists(dirname(__DIR__) . '/' . $uploadFilename)) {
    $index = str_replace("{{IMAGE}}", url_origin($_SERVER, true) . '/' . $uploadFilename, $index);
  }
} else {
  $index = str_replace('{{IMAGE}}', url_origin($_SERVER, true) . '/' . 'img/og_image_en.jpg', $index);
}

echo $index;
