<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 27/01/15
 * Time: 22:48
 */

namespace app\controllers;

use app\helpers\AJAXAnswer;
use app\models\UsersModel;
use SFramework\Exceptions\InputNotSetException;
use SFramework\Exceptions\MissingParamsException;
use SFramework\Helpers\Authentication;
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
            $filenamePOST = htmlentities(Input::post('filename'));

            if(Authentication::getInstance()->isAuthenticated()){
                $key = Input::post('key');
            }

            $data = explode(',', $filePOST);
            if(!in_array($data[0], $acceptedFormat)) {
                throw new \Exception('Le format envoyé n\'est pas valide');
            }
            $realFileName = $filenamePOST;
            $fileName = hash('sha256', uniqid());
            $file = new \SplFileObject('content/' . $fileName , 'wb');
            $file->fwrite($data[0] . ',' . $data[1]);

            $this->imageModel->addFile($fileName);
            if(Authentication::getInstance()->isAuthenticated()){
                $this->imageModel->addUserFile(intval(Authentication::getInstance()->getUserId()),
                    $fileName, $key, $realFileName);
            }
            $success = new AJAXAnswer(true, $fileName);
            $success->answer();
        }
        catch(InputNotSetException $e)
        {
            $error = new AJAXAnswer(false);
            $error->setMessage('L\'image envoyée est trop lourde (taille conseillée < 2mo)');
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
            $this->getView()->render('home/view');
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
            $image = file_get_contents('content/' . $imageID);
            $response = new AJAXAnswer(true, $image);
            $response->answer(true);
        }
        catch(InputNotSetException $e)
        {
            $error = new AJAXAnswer(false, $e->getMessage());
            $error->answer();
        }
        catch(Exception $e)
        {
            $error = new AJAXAnswer(false, 'Une erreur est survenue durant la'
                . ' récupération de l\'image, veuillez'
                . ' rééssayer ou contacter l\'administrateur du site');
            $error->answer();
        }
    }

    public function register()
    {
        try
        {
            $username = Input::post('username');
            $firstname = Input::post('firstname');
            $lastname = Input::post('lastname');
            $password = Input::post('password');
            $password_confirm = Input::post('password_confirm');
            $mail = Input::post('mail');
            $master_key = Input::post('master_key');

            if(empty($username) || empty($firstname) || empty($lastname) ||
                empty($password) || empty ($password_confirm) || empty($mail)
                || empty($master_key)){
                throw new \Exception('Certains champs saisis sont vides');
            }
            if(strlen($master_key) < 10){
                throw new \Exception('La clé principale n\' est pas assez
                longue');
            }
            if($password != $password_confirm){
                throw new \Exception('Les deux mots de passes ne sont pas
                identiques');
            }
            $userModel = new UsersModel();
            $isUserExists = $userModel->userExist($username);

            $isUserExists = $isUserExists[0]['COUNT(username)'];

            if($isUserExists != 0){
                throw new \Exception('Ce nom d\'utilisateur existe déjà');
            }

            $username = strtolower($username);
            $password = sha1($password);
            $master_key = sha1($master_key);

            $userModel->register($username, $firstname, $lastname, $mail,
                $password, $master_key);

            $success = new AJAXAnswer(true, 'Inscription réussie');
            $success->answer();
        }
        catch(InputNotSetException $e)
        {
            $error = new AJAXAnswer(false, $e->getMessage());
            $error->answer();
        }
        catch(\Exception $e)
        {
            $error = new AJAXAnswer(false, $e->getMessage());
            $error->answer();
        }
    }

    public function doesUserExist()
    {
        try
        {
            $params = $this->getParams();
            $username = $params[0];
            $userModel = new UsersModel();

            $userExist = $userModel->userExist($username);
            $userExist = $userExist[0]['COUNT(username)'];

            $response = new AJAXAnswer();

            if(!$userExist){
                $response->setSuccess(true);
            } else {
                $response->setSuccess(false);
            }

            $response->answer();
        }
        catch(\Exception $e)
        {
            $error = new AJAXAnswer(false, $e->getMessage());
            $error->answer();
        }
    }

    public function connect()
    {
        try
        {
            $username = Input::post('username');
            $password = sha1(Input::post('password'));

            $userModel = new UsersModel();
            $result = $userModel->connect($username, $password)[0]['LOL'];
            if($result != 1){
                throw new \Exception('Les identifiants ne sont pas valides');
            } else {
                $infos = $userModel->getInfos($username)[0];

                $informations = new \stdClass();
                $informations->firstname = $infos['firstname'];
                $informations->lastname = $infos['lastname'];
                $informations->username = $username;

                Authentication::getInstance()->setAuthenticated($username,
                    $infos['id']);

                $response = new AJAXAnswer(true, $informations);
                $response->answer();
            }
        }
        catch(InputNotSetException $e)
        {
            $error = new AJAXAnswer(false, 'Un champ est manquant');
            $error->answer();
        }
        catch(\Exception $e)
        {
            $error = new AJAXAnswer(false, $e->getMessage());
            $error->answer();
        }
    }

    public function disconnect()
    {
        Authentication::getInstance()->disconnect();
        $this->getView()->redirect('/');
    }

    public function check()
    {
        if(Authentication::getInstance()->isAuthenticated()){
            $userModel = new UsersModel();
            $master = $userModel->getMasterKey(Authentication::getInstance()->getUserName());
            $master = $master[0]['master_key'];

            $response = new AJAXAnswer(true, $master);
        } else {
            $response = new AJAXAnswer(false, '');
        }

        $response->answer();
    }

    public function admin()
    {
        $this->getView()->render('home/admin');
    }

    public function getImages()
    {
        if(Authentication::getInstance()->isAuthenticated()){
            $info = $this->imageModel->getUsersImages(Authentication::getInstance()->getUserId());

            $content = [];
            foreach($info as $key => $value){
                $content[$key] = new \stdClass();
                $content[$key]->imageid = $value['imageid'];
                $content[$key]->key = $value['key'];
                $content[$key]->uploaded = $value['up'];
                $content[$key]->filename = html_entity_decode($value['imagename']);
            }
            $response = new AJAXAnswer(true, $content);
        } else {
            $response = new AJAXAnswer(false, 'Vous n\'etes pas connecté !');
        }

        $response->answer();
    }

    public function deleteImage()
    {
        try
        {
            $params = $this->getParams();
            $imageID = $params[0];
            if(!Authentication::getInstance()->isAuthenticated()){
                throw new \Exception('Vous n\'etes pas connecté');
            }

            $userID = Authentication::getInstance()->getUserId();
            $id = $this->imageModel->checkOwner($userID, $imageID);
            if(empty($id)){
                throw new \Exception('Cette image n\'est pas à vous !');
            }

            $this->imageModel->deleteImage($userID, $imageID);
            unlink('content/' . $imageID);
            $response = new AJAXAnswer(true, 'Image supprimée');
            $response->answer();
        }
        catch(MissingParamsException $e)
        {
            $error = new AJAXAnswer(false, 'Aucune image n\'est indiqué');
            $error->answer();
        }
        catch(\Exception $e)
        {
            $error = new AJAXAnswer(false, $e->getMessage());
            $error->answer();
        }
    }

    public function about()
    {
        $this->getView()->render('/home/about');
    }

    public function partners()
    {
        $this->getView()->render('/home/partners');
    }
}
