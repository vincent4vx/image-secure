<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 27/12/14
 * Time: 23:19
 */

namespace SFramework\Exceptions;

use Exception;

class HelperAlreadyExistsException extends SException
{
    public function __construct($helper, $code = 0, Exception $previous = null)
    {
        $message = 'The helper ' . $helper . ' already exists !';

        parent::__construct($message, $code, $previous);
    }
}