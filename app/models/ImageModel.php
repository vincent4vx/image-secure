<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 03/03/15
 * Time: 00:54
 */

namespace app\models;
use SFramework\Database\DatabaseProvider;
use SFramework\mvc\Model;

class ImageModel extends Model
{
    public function addFile($filename)
    {
        $query = 'INSERT INTO images VALUES(?)';

        DatabaseProvider::connection()->execute($query, [$filename]);
    }
}