<?php

namespace Application\Service;

use Zend\Mvc\Controller\AbstractRestfulController;
use Application\Model\Favoris;
use Application\Form\FavorisForm;
use Application\Model\FavorisTable;
use Zend\View\Model\JsonModel;

class FavorisServiceController extends AbstractRestfulController 
{
	protected $favorisTable;
	
	public function __construct(FavorisTable $table) 
	{
		$this->favorisTable = $table;
	}
	
	public function getList() {
		$username = $this->params()->fromQuery('username');
		$results = $this->favorisTable->getWithUsername($username);
		$data = array ();
		foreach ( $results as $result ) {
			$data [] = $result;
		}
		return new JsonModel(array('data' => $data));
	}
	
	public function create($data) {
	
		$favori = new Favoris();
		$favori->username = $data['username'];
		$favori->libelle = $data['libelle'];
		$favori->routerlink = $data['routerlink'];
		$favori->params = $data['params'];
		$id = $this->favorisTable->saveFavori($favori);
		$result = $this->favorisTable->getFavori($id);
		return new JsonModel(array(
				'data' => $result,
		));
	}
	
	public function delete($id) {

			$this->favorisTable->deleteFavori($id);
	
			return new JsonModel(array("data" => array(

	
			)));
	}
	public function update($id, $data) {
		$favori = new Favoris();
		$favori->id_favoris = $id;
		$favori->username = $data['username'];
		$favori->libelle = $data['libelle'];
		$favori->routerlink = $data['routerlink'];
		$favori->params = json_encode($data['params']);
		$id = $this->favorisTable->saveFavori($favori);
		$result = $this->favorisTable->getFavori($id);
		return new JsonModel(array(
				'data' => $result,
		));
	
	}
	
	public function getFavorisTable() {
		return $this->favorisTable;
	}
}