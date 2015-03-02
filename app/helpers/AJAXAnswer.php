<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 03/03/15
 * Time: 00:35
 */

namespace app\helpers;

/**
 * Class AJAXAnswer
 * @package app\helpers
 */
class AJAXAnswer
{
    /**
     * Success of the AJAX answer
     * @var bool
     */
    private $success = false;

    /**
     * Message of the AJAX answer
     * @var string
     */
    private $message;

    /**
     * @param bool $success
     * @param string $message
     */
    public function __construct($success = false, $message = "")
    {
        $this->success = $success;
        $this->message = $message;
    }

    /**
     * Setter for success
     * @param $success
     */
    public function setSuccess($success) { $this->success = $success; }
    /**
     * Setter for message
     * @param $message
     */
    public function setMessage($message) { $this->message = $message; }

    /**
     * Getter for success
     * @return bool
     */
    public function getSuccess() { return $this->success; }

    /**
     * Display the AJAX answer (in JSON)
     */
    public function answer() { echo json_encode($this); }
}