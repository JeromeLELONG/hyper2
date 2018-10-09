<?php
namespace Application\Service;

use Zend\Mvc\Controller\AbstractRestfulController;
 
use Presence\Model\Presence;
use Presence\Form\PresenceForm;
use Presence\Model\PresenceTable;
use Zend\View\Model\JsonModel;
use Application\Model\CoursTable;
use Application\Model\Cours;
use Zend\Db\Sql\Expression;

class PresenceServiceController extends AbstractRestfulController
{
    protected $presenceTable;
    protected $coursTable;
    
    public function __construct(PresenceTable $presencetable, CoursTable $courstable)
    {
        $this->presenceTable = $presencetable;
        $this->coursTable = $courstable;
    }
    
    public function getList()
    {
        ini_set('memory_limit', '512M');
        if($this->params()->fromQuery('getlistetypes'))
    	{
    		$results = $this->getPresenceTable()->ListeTypesSeances();
    	}
    	elseif($this->params()->fromQuery('getlistesallesparheure'))
    	{
    		$groupe = $this->params()->fromQuery('groupe');
    		$results = $this->getPresenceTable ()->ListeSallesParNombreHeures($this->params()->fromQuery('date_debut'),
    				$this->params()->fromQuery('date_fin'),
    				$groupe);
    	}
    	elseif($this->params()->fromQuery('gettauxocc'))
    	{
    		$listeSalles = json_decode($this->params()->fromQuery('salles'));
    		$results = $this->getPresenceTable()->getTauxOccupationAvecDate($this->params()->fromQuery('date_debut'),
    				$this->params()->fromQuery('date_fin'),
    				$listeSalles);
    	}
    	elseif($this->params()->fromQuery('date_debut') && $this->params()->fromQuery('date_fin'))
    	{
    		$listeSalles = json_decode($this->params()->fromQuery('salles'));
    		$listeEnseignants = json_decode($this->params()->fromQuery('enseignants'));
    		$listeMatieres = json_decode($this->params()->fromQuery('matieres'));
    		$results = $this->getPresenceTable()->getListePresenceAvecDate($this->params()->fromQuery('date_debut'),
    				$this->params()->fromQuery('date_fin'),
    				$listeSalles,
    				$listeEnseignants,
    				$listeMatieres);
    	}
    	elseif($this->params()->fromQuery('listeID'))
    	{
    		$listeID = json_decode($this->params()->fromQuery('listeID'));
    		$listeID->data [] = ""; //pour gérer les requêtes sans ID
    		$results = $this->getPresenceTable ()->fetchFromListeID ( $listeID->data );
    	}
    	elseif($this->params()->fromQuery('getlisteenseignants'))
    	{
    		$results = $this->getPresenceTable ()->ListeEnseignantsDistinct(json_decode($this->params()->fromQuery('getlisteenseignants')));
    	}
    	elseif($this->params()->fromQuery('getlistematieres'))
    	{
    		$results = $this->getPresenceTable ()->ListeMatieresDistinct($this->params()->fromQuery('getlistematieres'));
    	}
    	else
        $results = $this->getPresenceTable()->fetchAll(true);
        $page = (int) $this->params()->fromQuery('page', 1);
        $page = ($page < 1) ? 1 : $page;
        if(!$this->params()->fromQuery('date_debut') && !$this->params()->fromQuery('listeID')
        		&& !$this->params()->fromQuery('getlisteenseignants') && !$this->params()->fromQuery('getlistetypes')
        		&& !$this->params()->fromQuery('getlistematieres') && !$this->params()->fromQuery('getlistesallesparheure'))
        {
        $results->setCurrentPageNumber($page);
        // Set the number of items per page to 10:
        $results->setItemCountPerPage(10);
        
        }
        $data = array();
        $entry = (object) [];
        foreach($results as $result) {
            $data[] = $result;

        }
        if(!$this->params()->fromQuery('date_debut') && !$this->params()->fromQuery('listeID')
        		&& !$this->params()->fromQuery('getlisteenseignants') && !$this->params()->fromQuery('getlistetypes')
        		&& !$this->params()->fromQuery('getlistematieres') && !$this->params()->fromQuery('getlistesallesparheure'))
        $results->setItemCountPerPage(1);
        return new JsonModel ( array (
        		'data' => $data,
        		'rows' => $results->count()
        ) );
        //return new JsonModel(array($data));
    }
 
public function get($id)
{
    $presence = $this->getPresenceTable()->getPresence($id);
 
    return new JsonModel(array("nolot" => $presence->nolot, "nofiche" => $presence->nofiche, "id" => $presence->id));
}
 
public function create($data)
{
    $presence = new Presence();
    $cours = new Cours();
    $result = array ();
    foreach($data as $coursID)
    {
        
        try {
            $presenceExists = $this->getPresenceTable()->getPresence($coursID);
            if(!isset($presenceExists))
            {
                //$this->tableGateway->update ( $data, [
                //    'id' => $id
                //] );
                //return $id;
            }
            
        } catch (\Exception $f) {
            $cours = $this->coursTable->getCours($coursID);
            $presence->id = $cours->id;
            $dateTransform = explode("/",$cours->ddebut);
            $presence->dateraw = mktime(0,0,0,$dateTransform[1],$dateTransform[0],$dateTransform[2]);
            $presence->datesem = $cours->ddebut;
            $presence->hdebut = $cours->hdebut;
            $presence->hfin = $cours->hfin;
            $presence->codesalle = $cours->codesalle;
            $presence->codepole = $cours->libdiplome;
            $presence->codeue = $cours->codemat;
            $presence->jour = $cours->jour;
            $presence->enseignant = $cours->enseignant;
            $presence->chaire = $cours->matiere.' '.strip_tags($cours->codediplome);
            $presence->groupe = $this->params()->fromQuery('groupe');
            $presence->valide = 'N';
            $presence->type = $cours->type;
            $presence->datefichier = new \Zend\Db\Sql\Expression("NOW()");
            //public $video;
            $this->getPresenceTable()->savePresence($presence);
        }
        //$presenceExists = $this->getPresenceTable()->getPresence($coursID);



    	$presenceVerif = $this->getPresenceTable()->getPresence($coursID);
    	$result [] = $presenceVerif;
    }

    
    return new JsonModel(array(
        'data' => $result,
    ));
}
 
public function update($id, $data)
{
    $data['id'] = $id;
    $data['type'] = $data['typecours'];
    $presence = $this->getPresenceTable()->getPresence($id);
    $form  = new PresenceForm();
    
    $form->bind($presence);
    $form->setInputFilter($presence->getInputFilter());
    $form->setData($data);

    if ($form->isValid()) {  
        $id = $this->getPresenceTable()->savePresence($form->getData());
    }
 
    return new JsonModel(array(
        'data' => $this->getPresenceTable()->getPresence($id),
    ));
}
 
public function delete($id)
{
    $this->getPresenceTable()->deletePresence($id);
 
    return new JsonModel(array(
        'data' => 'deleted',
    ));
}
    
    public function getPresenceTable()
    {
        return $this->presenceTable;
    }
}