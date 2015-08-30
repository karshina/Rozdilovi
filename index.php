<?php

include_once 'utils.php';

$index = file_get_contents(__DIR__ . '/index.html');

$index = str_replace('{{URL}}', htmlspecialchars(full_url($_SERVER, true)), $index);

if (isset($_GET['img'])) {
  $uploadFilename = 'uploads/' . preg_replace('/[^a-z\d]/i', '', $_GET['img']) . '.png';
  if (file_exists(__DIR__ . '/' . $uploadFilename)) {
    $index = str_replace("{{IMAGE}}", url_origin($_SERVER, true) . '/' . $uploadFilename, $index);
  }
} else {
  $index = str_replace('{{IMAGE}}', '', $index);
}

echo $index;
