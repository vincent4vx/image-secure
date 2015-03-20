<?php
/**
 * Created by PhpStorm.
 * User: loick
 * Date: 08/12/14
 * Time: 11:24
 */

namespace SFramework\mvc;

use SFramework\Exceptions\InvalidModelClassException;
use SFramework\Exceptions\MissingParamsException;
use SFramework\Helpers\ControllerHelpers;

class Controller
{
    public $helpers;
    private $loader;
    private $view;
    private $params;

    function __construct()
    {
        $this->loader = new \Twig_Loader_Filesystem('app/views');
        $this->view = new View($this->loader);
        $this->helpers = new ControllerHelpers();
    }

    /**
     * @param $model
     * @return object
     * @throws InvalidModelClassException
     */
    public function loadModel($model)
    {
        $classInfo = new \ReflectionClass('app\models\\' . $model . 'Model');
        if ($classInfo->getParentClass()->isSubclassOf('SFramework\mvc\Model')) {
            throw new InvalidModelClassException($model);
        }
        return $classInfo->newInstance();
    }

    /**
     * @param bool $ignore
     * @return mixed
     * @throws MissingParamsException
     */
    public function getParams($ignore = false)
    {
        if (empty($this->params) && !$ignore) {
            throw new MissingParamsException();
        }
        return $this->params;
    }

    /**
     * @param array $params
     */
    public function setParams($params)
    {
        $this->params = $params;
    }

    /**
     * @return \SFramework\mvc\View
     */
    public function getView()
    {
        return $this->view;
    }
} 