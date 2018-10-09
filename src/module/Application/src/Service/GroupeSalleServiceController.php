<?php

namespace Application\Service;

use Zend\Mvc\Controller\AbstractRestfulController;
use Application\Model\GroupeSalle;
use Application\Form\GroupeSalleForm;
use Application\Model\GroupeSalleTable;
use Zend\View\Model\JsonModel;

class GroupeSalleServiceController extends AbstractRestfulController 
{
	protected $groupeSalleTable;
	
	public function __construct(GroupeSalleTable $table) 
	{
		$this->groupeSalleTable = $table;
	}
	
	public function getList() {
		if($this->params()->fromQuery('distinct') == "true")
		{
			$results = $this->getGroupeSalleTable()->getGroupeDistinct();
		}
		elseif($this->params()->fromQuery('groupe'))
		{
			$results = $this->getGroupeSalleTable()->getSallesAffectees($this->params()->fromQuery('groupe'));
		}
		else
		$results = $this->getGroupeSalleTable()->fetchAll();
		$data = array();
		$entry = (object) [];
		foreach($results as $result) {
			$data[] = $result;
		}
		
		return new JsonModel(array('data' => $data));
	}
	
	public function get($id) {
		if($this->params()->fromQuery('code') && $this->params()->fromQuery('groupe'))
		{
			$groupesalle = $this->getGroupeSalleTable()->getGroupeSalleCodeNum($this->params()->fromQuery('code'),$this->params()->fromQuery('groupe'));
		}
		else
		$groupesalle = $this->getGroupeSalleTable()->getGroupeSalle($id);
		return new JsonModel(array(
				"code" => $groupesalle->code, 
				"num_groupe" => $groupesalle->num_groupe,
				"lib_groupe" => $groupesalle->lib_groupe,
				"lib_groupe_long" => $groupesalle->lib_groupe_long,
				"id_groupesalle" => $groupesalle->id_groupesalle,
				

		));
	}
	public function create($data) {
		$groupesalle = new GroupeSalle();
		$form = new GroupeSalleForm();
		$form->setInputFilter($groupesalle->getInputFilter());
		$form->setData($data);
		
		if ($form->isValid()) {
			$groupesalle->exchangeArray($form->getData());
			$id = $this->getGroupeSalleTable()->saveGroupeSalle($groupesalle);
			return new JsonModel(array(
					'data' => $this->getGroupeSalleTable()->getGroupeSalle($id),
			));
		}
		return new JsonModel(array(
				'data' => 'Erreur lors de la création du groupe',
		));

	}
	public function update($id, $data) {
		$data['id'] = $id;
		$groupesalle = $this->getGroupeSalleTable()->getGroupeSalle($id);
		$form  = new GroupeSalleForm();
		$form->bind($groupesalle);
		$form->setInputFilter($groupesalle->getInputFilter());
		$form->setData($data);
		if ($form->isValid()) {
			
			$id = $this->getGroupeSalleTable()->saveGroupeSalle($form->getData());
		}
		
		return new JsonModel(array(
				'data' => $this->getGroupeSalleTable()->getGroupeSalle($id),
		));

	}
	public function delete($id) {
		$groupesalle = new GroupeSalle();
		if($this->params()->fromQuery('groupe'))
		{
			$this->getGroupeSalleTable()->deleteGroupeTotal($this->params()->fromQuery('groupe'));
		}
		else
		$this->getGroupeSalleTable()->deleteGroupeSalle($id);
		
		return new JsonModel(array("data" => array(
				"code" => $groupesalle->code,
				"num_groupe" => $groupesalle->num_groupe,
				"lib_groupe" => "deleted",
				"lib_groupe_long" => $groupesalle->lib_groupe_long,
				"id_groupesalle" => $id,
		
		
		)));
	}
	public function getGroupeSalleTable() {
		return $this->groupeSalleTable;
	}
}