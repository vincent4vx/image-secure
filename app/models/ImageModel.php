<?php
/**
 * Created by PhpStorm.
 * User: thomasmunoz
 * Date: 03/03/15
 * Time: 00:54
 */

namespace app\models;
use SFramework\Database\Database;
use SFramework\Database\DatabaseProvider;
use SFramework\mvc\Model;

class ImageModel extends Model
{
    public function addFile($filename)
    {
        $query = 'INSERT INTO images VALUES(?)';

        DatabaseProvider::connection()->execute($query, [$filename]);
    }

    public function addUserFile($userid, $imageid, $key)
    {
        $query = 'INSERT INTO `users-images` VALUES (?, ?, ?, now())';

        DatabaseProvider::connection()->execute($query, [$userid, $imageid, $key]);
    }

    public function getDate()
    {
        $query = 'SELECT UNIX_TIMESTAMP(uploaded) AS DATE FROM `users-images`';

        return DatabaseProvider::connection()->query($query);
    }

    public function getUsersImages($userID)
    {
        $query = 'SELECT imageid, `key`, UNIX_TIMESTAMP(uploaded) AS up'
                . ' FROM `users-images` '
                 . ' WHERE userid = ?';

        return DatabaseProvider::connection()->query($query, [$userID]);
    }
}