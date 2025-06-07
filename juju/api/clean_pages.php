<?php
$pages_dir = __DIR__ . '/../pages/';
$ttl_days = 30;
foreach (glob($pages_dir . "*.html") as $file) {
    if (filemtime($file) < time() - 60*60*24*$ttl_days) {
        unlink($file);
    }
}