<?php
/**
 * Created by PhpStorm.
 * User: sknz
 * Date: 13/01/15
 * Time: 16:51
 */

namespace SFramework\Exceptions;

use Exception;

class JsonSyntaxException extends SException
{
    public function __construct($fileName, $code = 0, Exception $previous = null)
    {
        parent::__construct('Bad JSON syntax/unknown error in file ' . $fileName, $code, $previous);
    }
}