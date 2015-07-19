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

define('DEBUG', false);

if (DEBUG) {
    ini_set('display_errors', true);
    ini_set('html_errors', true);
    error_reporting(E_ALL);
}else{
    error_reporting(0);
    ini_set('display_errors', false);
}

function main()
{
    DatabaseProvider::connect("app/config/database.json");

    $router = new \SFramework\Routing\Router();

    $router->add('/errors/err404', new \app\controllers\ErrorsController(), 'err404');
    $router->add('/image/view', new \app\controllers\HomeController(), 'view');
    $router->add('/image/get', new \app\controllers\HomeController(), 'getImage');
    $router->add('/image/delete', new \app\controllers\HomeController(), 'deleteImage');
    $router->add('/upload', new \app\controllers\HomeController(), 'upload', 'POST');
    $router->add('/register', new \app\controllers\HomeController(),
        'register', 'POST');
    $router->add('/users/admin', new \app\controllers\HomeController(), 'admin');
    $router->add('/users/exist', new \app\controllers\HomeController(), 'doesUserExist');
    $router->add('/users/connect', new \app\controllers\HomeController(), 'connect', 'POST');
    $router->add('/users/disconnect', new \app\controllers\HomeController(), 'disconnect');
    $router->add('/users/getimages', new \app\controllers\HomeController(), 'getImages');
    $router->add('/check', new \app\controllers\HomeController(), 'check');
    $router->add('/about', new \app\controllers\HomeController(), 'about');
    $router->add('/partners', new \app\controllers\HomeController(), 'partners');
    $router->add('/', new \app\controllers\HomeController(), 'index');  

    $router->matchCurrentRequest();
}

if (DEBUG) {
    main();
} else {
    try {
        main();
    } catch (Exception $e) {
        http_response_code(500);
        echo 'Internal server error.';
    }
}
