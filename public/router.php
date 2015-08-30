<?php
// php router script for development purposes 

if (file_exists(__DIR__.$_SERVER["SCRIPT_NAME"]) && $_SERVER["SCRIPT_NAME"] != "/index.html") {
    return false;    // serve the requested resource as-is.
}

if ($_SERVER["REQUEST_URI"] == "/upload/") {
  include_once __DIR__ . "/../upload.php";
} else {
  include_once __DIR__ . "/../index.php";
}
