<?php
/**
 * Created by PhpStorm.
 * User: thomas
 * Date: 17/03/15
 * Time: 14:42
 */

namespace app\models;


use SFramework\Database\DatabaseProvider;

class UsersModel
{
    public function userExist($username)
    {
        $query = 'SELECT COUNT(username)'
                   . ' FROM users'
                    . ' WHERE username = :username';

        return DatabaseProvider::connection()->query($query,
            ['username' => $username]);
    }

    public function register($username, $firstname, $lastname, $mail, $password,
                            $master_key)
    {
        $query = 'INSERT INTO users (username, firstname, lastname, mail, password,
                  master_key)'
                  . ' VALUES(:username, :firstname, :lastname, :mail, :password,
                            :master_key);';

        DatabaseProvider::connection()->execute($query,
            ['username' => $username, 'firstname' => $firstname,
                'lastname' => $lastname, 'mail' => $mail,
                'password' => $password, 'master_key' => $master_key]);
    }

    public function connect($username, $password)
    {
        $query = 'SELECT COUNT(id) AS LOL'
                . ' FROM users'
                . ' WHERE username = ? AND password = ?';

        return DatabaseProvider::connection()->query($query, [$username, $password]);
    }

    public function getInfos($username)
    {
        $query = 'SELECT id, firstname, lastname FROM users WHERE username = ?';

        return DatabaseProvider::connection()->query($query, [$username]);
    }

    public function getMasterKey($username)
    {
        $query = 'SELECT master_key FROM users WHERE username = ?';

        return DatabaseProvider::connection()->query($query, [$username]);
    }
} 