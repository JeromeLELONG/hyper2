<?php

namespace Application\Service;

use Zend\Mvc\Controller\AbstractRestfulController;
use Application\Model\User;
use Application\Model\UserTable;
use Zend\View\Model\JsonModel;

class UserServiceController extends AbstractRestfulController 
{
	protected $userTable;
	
	public function __construct(UserTable $table) 
	{
		$this->userTable = $table;
	}
	
	public function getList() {
        $data = array();
        $results = $this->getUserTable ()->fetchAll ();
        $entry = ( object ) [ ];
        foreach ( $results as $result ) {
            $data [] = $result;
        }
		return new JsonModel ( array (
				'data' => $data,
		) );
	}
	
	public function get($id) {

		return new JsonModel(array(


		));
	}
	public function create($data) {

		$user = new User();
		$user->exchangeArray($data['user']);
		if($this->getUserTable()->UserExists($user->username))
		    return new JsonModel(array(
		        'result' => 'Utilisateur existe déjà',
		    ));
		else
		 $this->getUserTable()->insertUser($user);
	    return new JsonModel(array(
				'result' => 'Utilisateur créé',
		));
	}
	public function update($id, $data) {
		$data['id'] = $id;
		$salle = $this->getSalleTable()->getSalle($id);
		$form  = new SalleForm();
		$form->bind($salle);
		$form->setInputFilter($salle->getInputFilter());
		$form->setData($data);
		if ($form->isValid()) {
			
			$id = $this->getSalleTable()->saveSalle($form->getData());
		}
		
		return new JsonModel(array(
				'data' => $this->getSalleTable()->getSalle($id),
		));

	}
	public function delete($username) {
	    $this->getUserTable()->deleteUser($username);
		return new JsonModel(array(
				'data' => 'deleted',
		));
	}
	public function getUserTable() {
		return $this->userTable;
	}
}