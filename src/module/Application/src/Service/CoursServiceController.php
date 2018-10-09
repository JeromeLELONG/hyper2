<?php

namespace Application\Service;

use Zend\Mvc\Controller\AbstractRestfulController;
use Application\Model\Cours;
use Application\Form\CoursForm;
use Application\Model\CoursTable;
use Zend\View\Model\JsonModel;

class CoursServiceController extends AbstractRestfulController 
{
	protected $coursTable;
	
	public function __construct(CoursTable $table) 
	{
		$this->coursTable = $table;
	}
	
	public function getList() 
	{
		$nbPages = 15;
		if($this->params()->fromQuery('getressources'))
		{
			if($this->params()->fromQuery('tranche') == 'true')
				$trancheHoraire = 1;
				elseif($this->params()->fromQuery('tranche') == 'false')
				$trancheHoraire = 2;
				else
					$trancheHoraire = 3;
					$nbPages = 1000;
					$results = $this->getCoursTable ()->getRessourcesDateEtGroupe($this->params()->fromQuery('date'), 
							$this->params()->fromQuery('groupe'),$this->params()->fromQuery('getressources'),$trancheHoraire);
		}
		elseif($this->params()->fromQuery('date') && $this->params()->fromQuery('groupe'))
		{
			if($this->params()->fromQuery('tranche') == 'true')
				$trancheHoraire = 1;
			elseif($this->params()->fromQuery('tranche') == 'false')
					$trancheHoraire = 2;
			else
				$trancheHoraire = 3;
			$nbPages = 1000;
			$results = $this->getCoursTable ()->getCoursDateEtGroupe($this->params()->fromQuery('date'), $this->params()->fromQuery('groupe'),$trancheHoraire);
		}
		elseif($this->params()->fromQuery('getlistematieres'))
		{
			$nbPages = 20;
			$results = $this->getCoursTable ()->ListeMatieresDistinct($this->params()->fromQuery('getlistematieres'));
		}
		elseif($this->params()->fromQuery('getlisteenseignants'))
		{
			$nbPages = 20;
			$results = $this->getCoursTable ()->ListeEnseignantsDistinct(json_decode($this->params()->fromQuery('getlisteenseignants')));
		}
		elseif($this->params()->fromQuery('datedebut') && $this->params()->fromQuery('datefin'))
		{
			$nbPages = 1000;
			$listeEnseignants = json_decode($this->params()->fromQuery('enseignants'));
			$listeMatieres = json_decode($this->params()->fromQuery('matieres'));
			$listeSalles = json_decode($this->params()->fromQuery('salles'));
			$results = $this->getCoursTable ()->getCoursDateEtSalle($this->params()->fromQuery('datedebut'), 
					$this->params()->fromQuery('datefin'),
					$listeSalles,
					$listeEnseignants,
					$listeMatieres);
		}
		else
			$results = $this->getCoursTable ()->fetchAll ( true );
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
				'rows' => $results->count()
		) );
	}
	
	public function get($id) {
		$cours = $this->getCoursTable ()->getCours ( $id );
		
		return new JsonModel ( array (
				'numero' => $cours->numero,
				'id' => $cours->id,
				'duree' => $cours->duree ,
				'cumul' => $cours->cumul,
				'ddebut' => $cours->ddebut,
				'dfin' => $cours->dfin,
				'nbsem' => $cours->nbsem,
				'jour' => $cours->jour,
				'hdebut' => $cours->hdebut,
				'hfin' => $cours->hfin,
				'type' => $cours->type,
				'codemat' => $cours->codemat,
				'matiere' => $cours->matiere,
				'enseignant' => $cours->enseignant,
				'codeenseignant' => $cours->codeenseignant,
				'codediplome' => $cours->codediplome,
				'libdiplome' => $cours->libdiplome,
				'codesalle' => $cours->codesalle,
				'salle' => $cours->salle,
				'pond' => $cours->pond,
				'prop' => $cours->prop,
				'memo' => $cours->memo,
				'date_modif' => $cours->date_modif,
		) );
	}
	public function create($data) {
		$form = new CoursForm ();
		$cours = new Cours ();
		$form->setInputFilter ( $cours->getInputFilter () );
		$form->setData ( $data );
		if ($form->isValid ()) {
			$cours->exchangeArray ( $form->getData () );
			$id = $this->getCoursTable ()->saveCours ( $cours );
		}
		
		return new JsonModel ( array (
				'data' => $this->getCoursTable ()->getCours ( $id ) 
		) );
	}
	public function update($id, $data) {
		$data ['id'] = $id;
		$cours = $this->getCoursTable ()->getCours ( $id );
		$form = new CoursForm ();
		$form->bind ( $cours );
		$form->setInputFilter ( $cours->getInputFilter () );
		$form->setData ( $data );
		if ($form->isValid ()) {
			$id = $this->getCoursTable ()->saveCours ( $form->getData () );
		}
		
		return new JsonModel ( array (
				'data' => $this->getCoursTable ()->getCours ( $id ) 
		) );
	}
	public function delete($id) {
		$this->getCoursTable ()->deleteCours ( $id );
		
		return new JsonModel ( array (
				'data' => 'deleted' 
		) );
	}
	public function getCoursTable() {
		return $this->coursTable;
	}
	

}
/* Update presenceservice
 $data = array(
 "id" => "testid",
 "dateraw" => '115351424425',
 "datesem" => '01/01/2018',
 );
 $data_json = json_encode($data);

 $ch = curl_init();
 curl_setopt($ch, CURLOPT_URL, 'https://hyperdev.cnam.fr/presenceservice/retarded');
 curl_setopt($ch, CURLOPT_HTTPHEADER, array(
 'Content-Type: application/json',
 'Content-Length: ' . strlen($data_json)
 ));
 curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
 curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
 curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 $response = curl_exec($ch);
 var_dump($response);
 curl_close($ch);
 */
/* Create presenceservice
 $service_url = 'https://hyperdev.cnam.fr/presenceservice';
 $curl = curl_init($service_url);
 $curl_post_data = array(
 "id" => "testid",
 "dateraw" => '115351424425',
 "datesem" => '01/01/2017',
 );
 curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
 curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
 curl_setopt($curl, CURLOPT_POST, true);
 curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
 $curl_response = curl_exec($curl);
 var_dump($curl_response);
 curl_close($curl);
 $presence = json_decode($curl_response);
 /*
 /*
 * Delete salleservice
 $ch = curl_init();
 curl_setopt($ch, CURLOPT_URL, 'https://hyperdev.cnam.fr/salleservice/1');
 curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
 curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 $response = curl_exec($ch);
 curl_close($ch);
 */
/*
 ** Update salleservice
 $data = array(
 'nom' => 'dog',
 'famille' => 'tall'
 );
 $data_json = json_encode($data);
  
 $ch = curl_init();
 curl_setopt($ch, CURLOPT_URL, 'https://hyperdev.cnam.fr/salleservice/1');
 curl_setopt($ch, CURLOPT_HTTPHEADER, array(
 'Content-Type: application/json',
 'Content-Length: ' . strlen($data_json)
 ));
 curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
 curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
 curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
 $response = curl_exec($ch);
 var_dump($response);
 curl_close($ch);
 $album = json_decode($response);
 */
/*
 ** Create salleservice
 $service_url = 'https://hyperdev.cnam.fr/salleservice';
 $curl = curl_init($service_url);
 $curl_post_data = array(
 "id" => 0,
 "famille" => 'test',
 "nom" => 'test de nom',
 );
 curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
 curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
 curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
 curl_setopt($curl, CURLOPT_POST, true);
 curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
 $curl_response = curl_exec($curl);
 var_dump($curl_response);
 curl_close($curl);
 $salle = json_decode($curl_response);
 */
/*
 $results = $this->getCoursTable ()->fetchAll ( true );
 $page = (int) $this->params()->fromQuery('page', 1);
 $page = ($page < 1) ? 1 : $page;
 $results->setCurrentPageNumber($page);
 // Set the number of items per page to 10:
 $results->setItemCountPerPage(100);
 $data = array ();
 $entry = ( object ) [ ];
 foreach ( $results as $result ) {
 if($result->enseignant <> null)
 	$data [] = array("nom_enseignant" => $result->enseignant);
 	}
 	$results->setItemCountPerPage(1);
 	return new JsonModel (array("results" => $data,
 	"status" => "OK"));
 	*/