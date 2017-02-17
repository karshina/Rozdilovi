<?php

include_once 'utils.php';

//if (strpos($_SERVER['HTTP_HOST'], 'rozdilovi.org') === false ) {
$index = file_get_contents(__DIR__ . '/2015.html');
//} else {
//  $index = file_get_contents(__DIR__ . '/indexstub.html');
//}

$index = str_replace('{{URL}}', htmlspecialchars(full_url($_SERVER, true)), $index);

if (isset($_GET['img'])) {
  $index = str_replace('{{DESC}}', '', $index);
  $index = str_replace('{{TITLE}}', '||', $index);
  $uploadFilename = 'uploads/' . preg_replace('/[^a-z\d]/i', '', $_GET['img']) . '.jpg';
  if (file_exists(__DIR__ . '/' . $uploadFilename)) {
    $index = str_replace("{{IMAGE}}", url_origin($_SERVER, true) . '/' . $uploadFilename, $index);
  }
} else {
  $index = str_replace('{{IMAGE}}', url_origin($_SERVER, true) . '/' . 'img/card8.png', $index);
  $index = str_replace('{{DESC}}', 'роздІловІ — це поетично-музично-візуальний проект від творчої агенції АртПоле. Текст і голос: Сергій Жадан, ідея та візуалізація: Оля Михайлюк, музика: Олексій Ворсоба і Влад Креймер.', $index);
  $index = str_replace('{{TITLE}}', 'роздІловІ', $index);
}

echo $index;
