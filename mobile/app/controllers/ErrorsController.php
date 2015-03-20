<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 27/01/15
 * Time: 22:49
 */

namespace app\controllers;


use SFramework\mvc\Controller;

class ErrorsController extends Controller{

    public function err404()
    {
        $this->getView()->render('errors/err404');
    }
}