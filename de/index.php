<?php

include_once '../utils.php';

//if (strpos($_SERVER['HTTP_HOST'], 'rozdilovi.org') === false ) {
$index = file_get_contents(__DIR__ . '/index.html');
//} else {
//	$index = file_get_contents(__DIR__ . '/indexstub.html');
//}

$index = str_replace('{{URL}}', htmlspecialchars(full_url($_SERVER, true)), $index);

if (isset($_GET['img'])) {
  $index = str_replace('{{DESC}}', '', $index);
  $index = str_replace('{{TITLE}}', '||', $index);
  $uploadFilename = 'uploads/' . preg_replace('/[^a-z\d]/i', '', $_GET['img']) . '.jpg';
  if (file_exists(dirname(__DIR__) . '/' . $uploadFilename)) {
    $index = str_replace("{{IMAGE}}", url_origin($_SERVER, true) . '/' . $uploadFilename, $index);
  }
} else {
  $index = str_replace('{{IMAGE}}', url_origin($_SERVER, true) . '/' . 'img/og_image_de.jpg', $index);
  $index = str_replace('{{DESC}}', 'rozdILovI ist ein multidisziplinäre Kunstprojekt von ArtPole / Ukraine. Тext / Stimme: Serhij Zhadan, Іdee / Visualisierung: Olja Mychajljuk, Мusik: Aleksej Vorsoba / Vlad Krejmer.', $index);
  $index = str_replace('{{TITLE}}', 'rozdILovI', $index);
}

echo $index;
