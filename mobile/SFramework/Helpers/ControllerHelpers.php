<?php
/**
 * Created by PhpStorm.
 * User: loick
 * Date: 05/01/15
 * Time: 21:59
 */

namespace SFramework\Helpers;

class ControllerHelpers
{
    /**
     * @var \SFramework\Helpers\Popup
     */
    public $popup;

    function __construct()
    {
        $this->popup = new Popup();
    }
}