<?php

require 'vendor/autoload.php';
use SFramework\Database\DatabaseProvider;
session_start();

define('CR', "\n");
define('TAB', '    ');

define('DS', DIRECTORY_SEPARATOR);
define('FSROOT', __DIR__ . DS);

if (dirname($_SERVER['SCRIPT_NAME']) != '/') {
    define('WEBROOT', dirname($_SERVER['SCRIPT_NAME']) . DS);
} else {
    define('WEBROOT', dirname($_SERVER['SCRIPT_NAME']));
}

define('DEBUG', true);

if (DEBUG) {
    ini_set('display_errors', true);
    ini_set('html_errors', true);
    error_reporting(E_ALL);
}

function main()
{
    DatabaseProvider::connect("app/config/database.json");

    $router = new \SFramework\Routing\Router();

    $router->add('/errors/err404', new \app\controllers\ErrorsController(), 'err404');
    $router->add('/upload', new \app\controllers\HomeController(), 'upload', 'POST');
    $router->add('/', new \app\controllers\HomeController(), 'index');  

    $router->matchCurrentRequest();
}

if (DEBUG) {
    main();
} else {
    try {
        main();
    } catch (Exception $e) {
        echo 'Internal server error.';
    }
}
