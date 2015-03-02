<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 27/01/15
 * Time: 22:48
 */

namespace app\controllers;

use app\helpers\AJAXAnswer;
use SFramework\Exceptions\InputNotSetException;
use SFramework\Helpers\Input;
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
        try
        {
            $acceptedFormat = [
                'data:image/png;base64',
                'data:image/jpeg;base64',
                'data:image/gif;base64',
                'data:image/bmp;base64'
            ];

            $filePOST = Input::post('file');
            $filenamePOST = Input::post('filename');

            $data = explode(',', $filePOST);

            if(in_array($data[0], $acceptedFormat))
            {
                $fileName = sha1($filenamePOST . time());
                $file = new \SplFileObject('content/' . $fileName , 'wb');
                $file->fwrite(base64_decode($data[1]));
            }
        }
        catch(InputNotSetException $e)
        {
            $error = new AJAXAnswer(false);
            $error->setMessage('La requête envoyée au serveur n\'est pas complète, merci de rééssayer ou de contacter
                              l\'administrateur du site si cette même erreur survient');
            $error->answer();
        }
    }
}
