<?php
namespace Application\Model;

use Zend\Db\TableGateway\TableGateway;

class UserTable
{
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }

    public function getUser($username)
    {
        $rowset = $this->tableGateway->select(array('username' => $username));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $username");
        }
        return $row;
    }
    
    public function UserExists($username)
    {
        $rowset = $this->tableGateway->select(array('username' => $username));
        $row = $rowset->current();
 
        if (!$row) {
            return false;
        }
        return true;
    }

    public function insertUser($user)
    {
        $data = array(
            'username' => $user->username,
        	'password' => $user->password,
            'service' => $user->service,
            'nom'  => $user->nom,
            'prenom' => $user->prenom,
            'email' => $user->email,
            'role' => $user->role,
        );

        $this->tableGateway->insert($data);

    }
    
    public function updateUser($user)
    {
        $data = array(
            'username' => $user->username,
        	'password' => $user->password,
            'service' => $user->service,
            'nom'  => $user->nom,
            'prenom' => $user->prenom,
            'email' => $user->email,
            'role' => $user->role,
        );
    
        
       $this->tableGateway->update($data, array(
            'username' => $user->username
        ));

    }

    public function deleteUser($username)
    {
        $this->tableGateway->delete(array('username' =>  $username));
    }
}