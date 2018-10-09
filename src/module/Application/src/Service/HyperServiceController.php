<?php

namespace Application\Service;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\Soap\Client;
use Zend\Soap\AutoDiscover as SoapWsdlGenerator;
use Zend\Soap\Server as SoapServer;
use Application\Model\Cours;
use Application\Model\CoursTable;
use Application\Model\Salle;

class HyperServiceController extends AbstractActionController
{
	protected $coursTable;

	public function __construct(CoursTable $table) 
	{

		$this->coursTable = $table;
	
	}
	
	public function indexAction() {
		
	}
	
	public function getSallesAction() {
		$config = new \Zend\Config\Config( include __DIR__.'/../../../../config/autoload/'.$_SERVER['APPLICATION_ENV'].'.local.php' );
		$client = new Client($config->HyperPlanning->salles->wsdl,
				array('login' => $config->HyperPlanning->server->login,
						'password' => $config->HyperPlanning->server->password
				));
		$listeIDSalles = $client->ToutesLesSalles();
		$listeNomsSalles = $client->NomsTableauDeSalles($listeIDSalles);
		$listeCodesSalles = $client->CodesTableauDeSalles($listeIDSalles);
		$listeCapaciteSalles = $client->CapacitesTableauDeSalles($listeIDSalles);
		$listeNombreSalles = $client->NombreSallesMaxTableauDeSalles($listeIDSalles);
		$listeCoutSalles = $client->CoutsHorairesTableauDeSalles($listeIDSalles);
		$listeProprietairesSalles = $client->ProprietairesTableauDeSalles($listeIDSalles);
		$SallesOutput = array();
		for($i = 0;$i < count($listeIDSalles->THpSvcWCleSalle);$i++)
		array_push($SallesOutput, array(
				'nom' => $listeNomsSalles->string[$i],
				'famille' => '',
				'capa' => $listeCapaciteSalles->unsignedInt[$i],
				'nbocc' => $listeNombreSalles->unsignedInt[$i],
				'occ' => $listeCoutSalles->double[$i],
				'prop' => $listeProprietairesSalles->string[$i],
				'code' => $listeCodesSalles->string[$i],
				'numero' => $listeIDSalles->THpSvcWCleSalle[$i],
		));
		return new JsonModel($SallesOutput);
	}
	
	public function verifCoursHPAction()
	{
		$this->getCoursTable()->LoadCours();
		$results = $this->getCoursTable ()->fetchAll ( true );
		$page = (int) $this->params()->fromQuery('page', 1);
		$page = ($page < 1) ? 1 : $page;
		$results->setCurrentPageNumber($page);
		// Set the number of items per page to 10:
		$results->setItemCountPerPage(10);
		$data = array ();
		$entry = ( object ) [ ];
		foreach ( $results as $result ) {
			$data [] = $result;
			var_dump($result);
		}
	}
	
	public function getCoursTable() {
		return $this->coursTable;
	}
}