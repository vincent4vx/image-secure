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

    public function register($username, $firstname, $lastname, $mail, $password)
    {
        $query = 'INSERT INTO users VALUES(:userna0me, :firstname, :lastname, :mail, :password);';

        DatabaseProvider::connection()->execute($query,
            ['username' => $username, 'firstname' => $firstname,
                'lastname' => $lastname, 'mail' => $mail,
                'password' => $password]);
    }
} 