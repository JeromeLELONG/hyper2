<?php

namespace Application\Service;

use Zend\Mvc\Controller\AbstractRestfulController;
use Application\Model\Lot;
use Application\Form\LotForm;
use Application\Model\LotTable;
use Zend\View\Model\JsonModel;

class LotServiceController extends AbstractRestfulController 
{
	protected $lotTable;
	
	public function __construct(LotTable $table) 
	{
		$this->lotTable = $table;
	}
	
	public function getList() {
		$nbPages = 1000000;
		if($this->params()->fromQuery('username'))
		{
			$results = $this->getLotTable ()->getWithUsername($this->params()->fromQuery('username'));
		}
		else if($this->params()->fromQuery('listeID'))
		{
			$listeID = json_decode($this->params()->fromQuery('listeID'));
			$listeID->data [] = ""; //pour gérer les requêtes sans ID
			$results = $this->getLotTable ()->fetchFromListeID ( $listeID->data );
		}
		elseif($this->params()->fromQuery('nolot'))
		{
			$nolot = $this->params()->fromQuery('nolot');
			$results = $this->getLotTable ()->getLotAvecNumero ( $nolot );
		}
		else
		$results = $this->getLotTable ()->fetchAll ( true );
		
		$page = (int) $this->params()->fromQuery('page', 1);
		$page = ($page < 1) ? 1 : $page;
		$results->setCurrentPageNumber($page);
		// Set the number of items per page to 10:
		$results->setItemCountPerPage($nbPages);
		$data = array ();
		$entry = ( object ) [ ];
		foreach ( $results as $result ) {
			$data [] = $result;
		}
		$results->setItemCountPerPage(1);
		return new JsonModel ( array (
				'data' => $data,
				'rows' => $results->count(),
		) );
	}
	
	public function get($id) {
		$id_fiche = explode('-',$id);
		$fiche = $this->getLotTable()->getFiche($id_fiche[0],$id_fiche[1],$id_fiche[2]);
		return new JsonModel(array(
				"id" => $fiche->id, 
				"nolot" => $fiche->nolot,
				"nofiche" => $fiche->nofiche,
				"heure_edition" => $fiche->heure_edition,
				"username" => $fiche->username,

		));
	}
	public function create($data) {

		$form = new LotForm();
		$fiche = new Lot();
		$result = array ();
		$fiche->nofiche = 1;
		$fiche->nolot = $this->getLotTable()->getNouveauNumLot();
		foreach($data['listeID'] as $ficheID)
		{
				$fiche->id = $ficheID;
				$fiche->username = $data['username'];
				$fiche->groupe = $data['groupe'];
				$fiche_new = $this->getLotTable()->createFiche($fiche);
				$fiche->nofiche++;
				$result [] = $fiche_new;
		}
		
		return new JsonModel(array(
				'data' => $result,
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
		$id_fiche = explode('-',$id);
		$this->getLotTable()->deleteFiche($id_fiche[0],$id_fiche[1],$id_fiche[2]);
		
		return new JsonModel(array(
				'data' => 'deleted',
		));
	}
	public function getLotTable() {
		return $this->lotTable;
	}
}