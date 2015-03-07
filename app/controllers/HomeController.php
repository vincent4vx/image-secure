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
use SFramework\Exceptions\MissingParamsException;
use SFramework\Helpers\Input;
use SFramework\mvc\Controller;

class HomeController extends Controller
{

    /**
     * @var ImageModel model
     */
    private $imageModel;

    public function __construct()
    {
        $this->imageModel = $this->loadModel('Image');
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

            if(!in_array($data[0], $acceptedFormat)) {
                throw new \Exception('Le format envoyé n\'est pas valide');
            }

            $fileName = sha1($filenamePOST . time());
            $file = new \SplFileObject('content/' . $fileName , 'wb');
            $file->fwrite(base64_decode($data[1]));

            $this->imageModel->addFile($fileName);
            $success = new AJAXAnswer(true, $fileName);
            $success->answer();
        }
        catch(InputNotSetException $e)
        {
            $error = new AJAXAnswer(false);
            $error->setMessage('La requête envoyée au serveur n\'est pas complète, merci de rééssayer ou de contacter
                              l\'administrateur du site si cette même erreur survient');
            $error->answer();
        }
        catch(\Exception $e)
        {
            $error = new AJAXAnswer(false, $e->getMessage());
            $error->answer();
        }
    }

    public function view()
    {
        try
        {
            $params = $this->getParams();
            if(count($params) == 2)
                $this->getView()->render('home/view');
            else
                $this->getView()->render('home/view', ['missingKey' => true]);
        }
        catch(MissingParamsException $e)
        {
            $this->getView()->redirect('/');
        }
    }

    public function getImage()
    {
        try
        {
            $imageID = Input::get('id');
            $file = new \SplFileObject('content/' . $imageID , 'r');
            $response = new AJAXAnswer(true, $file->fread($file->getSize()));
            $file = null;
            $response->answer();

        }
        catch(InputNotSetException $e)
        {
            $error = new AJAXAnswer(false, $e->getMessage());
            $error->answer();
        }
        catch(Exception $e)
        {
            $error = new AJAXAnswer(false, 'Une erreur est survenue durant la récupération de l\'image, veuillez'
                . ' rééssayer ou contacter l\'administrateur du site');
            $error->answer();
        }
    }
}
