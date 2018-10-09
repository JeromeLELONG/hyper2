<?php

namespace Application\Service;

use Zend\Mvc\Controller\AbstractRestfulController;
use Application\Model\Salle;
use Application\Form\SalleForm;
use Application\Model\SalleTable;
use Zend\View\Model\JsonModel;

class SalleServiceController extends AbstractRestfulController 
{
	protected $salleTable;
	
	public function __construct(SalleTable $table) 
	{
		$this->salleTable = $table;
	}
	
	public function getList() {
		if($this->params()->fromQuery('groupe'))
		{
			$results = $this->getSalleTable()->getSallesDispos($this->params()->fromQuery('groupe'));
			$results->setItemCountPerPage(1000);
		}
		else
		$results = $this->getSalleTable()->fetchAll();
		$data = array();
		$entry = (object) [];
		foreach($results as $result) {
			$data[] = $result;
		}
		
		return new JsonModel(array('data' => $data));
		//return new JsonModel(array($data));
	}
	
	public function get($id) {
		$salle = $this->getSalleTable()->getSalle($id);
		return new JsonModel(array(
				"id" => $salle->id, 
				"famille" => $salle->famille,
				"capa" => $salle->capa,
				"nbocc" => $salle->nbocc,
				"occ" => $salle->occ,
				"prop" => $salle->prop,
				"code" => $salle->code,
				"numero" => $salle->numero,
		));
	}
	public function create($data) {
		$form = new SalleForm();
		$salle = new Salle();
		$form->setInputFilter($salle->getInputFilter());
		$form->setData($data);
		if ($form->isValid()) {
			$salle->exchangeArray($form->getData());
			$id = $this->getSalleTable()->saveSalle($salle);
		}
		
		return new JsonModel(array(
				'data' => $this->getSalleTable()->getSalle($id),
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
	public function delete($id) {
		$this->getSalleTable()->deleteSalle($id);
		
		return new JsonModel(array(
				'data' => 'deleted',
		));
	}
	public function getSalleTable() {
		return $this->salleTable;
	}
}