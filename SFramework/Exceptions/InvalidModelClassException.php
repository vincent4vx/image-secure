<?php
/**
 * Created by PhpStorm.
 * User: sknz
 * Date: 13/01/15
 * Time: 17:51
 */

namespace SFramework\Exceptions;

use Exception;

class InvalidModelClassException extends SException
{
    public function __construct($className, $code = 0, Exception $previous = null)
    {
        parent::__construct($className . ' is not a valid class.', $code, $previous);
    }
}