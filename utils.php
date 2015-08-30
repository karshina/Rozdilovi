<?php

function url_origin($s, $use_forwarded_host=false)
{
    if ($use_forwarded_host) {
      $ssl = $s['HTTP_X_FORWARDED_PROTO'] == 'https';
    } else {
      $ssl = (!empty($s['HTTPS']) && $s['HTTPS'] == 'on') ? true:false;
    }
    $sp = strtolower($s['SERVER_PROTOCOL']);
    $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
    $port = $s['SERVER_PORT'];
    $port = ((!$ssl && $port=='80') || ($ssl && $port=='443')) ? '' : ':'.$port;
    $host = ($use_forwarded_host && isset($s['HTTP_X_FORWARDED_HOST'])) ? $s['HTTP_X_FORWARDED_HOST'] : (isset($s['HTTP_HOST']) ? $s['HTTP_HOST'] : null);
    $host = isset($host) ? $host : $s['SERVER_NAME'] . $port;
    return $protocol . '://' . $host;
}

function full_url($s, $use_forwarded_host=false)
{
    return url_origin($s, $use_forwarded_host) . $s['REQUEST_URI'];
}

function getRandomHex($num_bytes=4) {
  return bin2hex(openssl_random_pseudo_bytes($num_bytes));
}
