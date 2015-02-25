<?php
/**
 * Created by PhpStorm.
 * User: loick
 * Date: 05/01/15
 * Time: 22:00
 */

namespace SFramework\Helpers;


class ViewHelpers
{
    /**
     * @var \SFramework\Helpers\Assets
     */
    public $assets;
    /**
     * @var \SFramework\Helpers\Popup
     */
    public $popup;

    function __construct()
    {
        $this->assets = new Assets();
        $this->popup = new Popup();
    }
}