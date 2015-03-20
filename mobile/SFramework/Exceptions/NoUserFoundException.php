<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 16/01/15
 * Time: 19:42
 */

namespace SFramework\Exceptions;

use Exception;

class NoUserFoundException extends SException
{
    public function __construct($name, $code = 0, Exception $previous = null)
    {
        $message = 'There is no user called "' . $name . '".';

        parent::__construct($message, $code, $previous);
    }
}