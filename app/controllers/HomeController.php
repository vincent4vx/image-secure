<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 27/01/15
 * Time: 22:48
 */

namespace app\controllers;

use SFramework\mvc\Controller;

class HomeController extends Controller
{

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $this->getView()->render('home/index');
    }

    public function upload()
    {
        /*var_dump($_POST);
        var_dump($_FILES);*/
        $acceptedFormat = [
            'data:image/png;base64',
            'data:image/jpeg;base64',
            'data:image/gif;base64',
            'data:image/bmp;base64'
        ];

        if(isset($_POST) && isset($_POST['file']) && !empty($_POST['file']))
        {
            $data = explode(',', $_POST['file']);
            var_dump($data[0]);
            if(in_array($data[0], $acceptedFormat))
            {
                echo 'bonjour je suis le vomi';
                $file = new \SplFileObject('content/test.jpg', 'wb');
                $file->fwrite(base64_decode($data[1]));
                $file = null;
                /*$ifp = fopen('content/test.jpg', "wb");
                fwrite($ifp, base64_decode($data[1]));
                fclose($ifp);*/
            }

        }
    }
}
