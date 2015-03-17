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
    $router->add('/image/view', new \app\controllers\HomeController(), 'view');
    $router->add('/image/get', new \app\controllers\HomeController(), 'getImage');
    $router->add('/upload', new \app\controllers\HomeController(), 'upload', 'POST');
    $router->add('/register', new \app\controllers\HomeController(),
        'register', 'POST');
    $router->add('/users/exist', new \app\controllers\HomeController(), 'doesUserExist');
    $router->add('/users/connect', new \app\controllers\HomeController(), 'connect', 'POST');
    $router->add('/users/disconnect', new \app\controllers\HomeController(), 'disconnect');
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
